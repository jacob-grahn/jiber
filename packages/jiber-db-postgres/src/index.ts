// TODO pushAction and stash state should really return promises

import { Pool, PoolConfig } from 'pg'
import { DB, RoomState, Action } from 'jiber-core'
import { toSafeTableName } from './to-safe-table-name'
import { safeInterval } from './safe-interval'

interface PostgresConfig extends PoolConfig {
  actionTable: string,
  roomTable: string,
  pollMs: number,
  tailMs: number
}

export const createDb = async (config: PostgresConfig): Promise<DB> => {
  const actionTable = toSafeTableName(config.actionTable || 'actions')
  const roomTable = toSafeTableName(config.roomTable || 'rooms')
  const pollMs = config.pollMs || 250
  const tailMs = config.tailMs || 60000
  const pool = new Pool(config)
  let lastActionId = 0

  await pool.connect()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${actionTable} (
      action_id serial    NOT NULL,
      sent_at   timestamp NOT NULL DEFAULT NOW(),
      action    text      NOT NULL
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${roomTable} (
      room_id    text      NOT NULL UNIQUE,
      state      text      NOT NULL,
      updated_at timestamp NOT NULL DEFAULT NOW()
    )
  `)

  const db: DB = {

    pushAction: (action: Action): void => {
      const strAction = JSON.stringify(action)
      pool.query(`
        INSERT INTO ${actionTable} (action)
        VALUES ($1::text)
      `, [strAction])
      .catch(console.log)
    },

    fetchState: async (roomId: string): Promise<RoomState> => {
      const result = await pool.query(`
        SELECT *
        FROM ${roomTable}
        WHERE room_id = $1::text
      `, [roomId])
      if (result.rows.length === 0) return { confirmed: undefined, members: [] as any, lastUpdatedAt: 0 }
      const strState = result.rows[0].state
      return JSON.parse(strState)
    },

    stashState: (roomId: string, state: RoomState): void => {
      const strState = JSON.stringify(state)
      pool.query(`
        INSERT INTO ${roomTable} (room_id, state)
        VALUES($1::text, $2::text)
        ON CONFLICT (room_id) DO UPDATE
        SET state = $2::text,
            updated_at = NOW()
        WHERE ${roomTable}.room_id = $1::text
      `, [roomId, strState])
      .catch(console.log)
    }
  }

  const loadNewActions = async (): Promise<any[]> => {
    const result = await pool.query(`
      SELECT *
      FROM ${actionTable}
      WHERE action_id > $1::int
      ORDER BY action_id ASC
    `, [lastActionId])
    result.rows.forEach(row => {
      const action = JSON.parse(row.action)
      action.$timeMs = row.sent_at
      lastActionId = row.action_id
      if (db.onaction) db.onaction(action)
    })
    return result.rows
  }

  const removeOldActions = async () => {
    await pool.query(`
      DELETE FROM ${actionTable}
      WHERE sent_at < NOW() - $1::interval
    `, [`${Math.ceil(tailMs / 1000)} seconds`])
  }

  safeInterval(loadNewActions, pollMs).catch(console.log)
  safeInterval(removeOldActions, Math.ceil(tailMs / 5)).catch(console.log)

  return db
}
