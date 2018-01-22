import { Pool, PoolConfig } from 'pg'
import { DB, Action } from 'jiber-core'
import { toSafeTableName } from './to-safe-table-name'
import { setupTable } from './setup-table'
import { listenToTable } from './listen-to-table'

interface PostgresConfig extends PoolConfig {
  Id: string,
  tablePrefix?: string,
  snapshotFrequency?: number
}

export const createDb = async (config: PostgresConfig): Promise<DB> => {
  const workerId = Math.round(Math.random() * 30000)
  const Id = config.Id
  const tablePrefix = config.tablePrefix || 'actions_'
  const snapshotFrequency = config.snapshotFrequency || 100

  const table = toSafeTableName(`${tablePrefix}${Id}`)
  const pool = new Pool(config)
  let lastActionId = 0
  let intervalId: any
  let state: any

  const conn = await pool.connect()
  await setupTable(pool, table)
  await listenToTable(pool, table)

  const db: DB = {
    dispatch: (action: Action): Promise<any> => {
      const strAction = JSON.stringify(action)
      return pool.query(`
        INSERT INTO ${table} (action, worker_id)
        VALUES ($1::jsonb, $2::smallint)
      `, [strAction, workerId])
    },

    close: (): void => {
      clearInterval(intervalId)
    }
  }

  const emitRow = (row: any) => {
    const action = JSON.parse(row.action)
    action.$timeMs = row.sent_at
    lastActionId = row.action_id
    if (db.onaction) {
      state = db.onaction(action)
    }
  }

  const snapshot = async (): Promise<any> => {
    const snapshotAction = { type: 'STATE', state }
    return pool.query(`
      BEGIN;
      DELETE FROM ${table}
      WHERE action_id < $2::integer;
      UPDATE ${table}
      SET action = $1::jsonb
      WHERE action_id = $2::integer;
      COMMIT;
    `, [snapshotAction, lastActionId])
  }

  const onNotification = async (msg: any) => {
    if (msg.channel === `${table}_insert`) {
      const row = JSON.parse(msg.payload)
      emitRow(row)
      if (row % snapshotFrequency === 0 && row.worker_id === workerId) {
        try {
          await snapshot()
        } catch (e) {
          console.log(e.message)
        }
      }
    }
  }

  conn.on('notification', onNotification)

  const loadHistory = async (): Promise<Action[]> => {
    const result = await pool.query(`
      SELECT *
      FROM ${table}
      ORDER BY action_id ASC
    `, [lastActionId])
    return result.rows
  }

  const rows = await loadHistory()
  rows.forEach(emitRow)

  return db
}
