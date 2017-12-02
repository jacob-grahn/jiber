import { Pool, PoolConfig } from 'pg'
import { DB, RoomState, Action } from 'jiber-core'

export const createDb = async (config: PoolConfig): Promise<DB> => {
  const pool = new Pool(config)
  let lastActionId = 0

  await pool.connect()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS actions (
      action_id serial    NOT NULL,
      sent_at   timestamp NOT NULL DEFAULT NOW(),
      action    text      NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id    text      NOT NULL UNIQUE,
      state      text      NOT NULL,
      updated_at timestamp NOT NULL DEFAULT NOW()
    )
  `)

  const db: DB = {

    pushAction: (action: Action): void => {
      const strAction = JSON.stringify(action)
      pool.query(`
        INSERT INTO actions (action)
        VALUES ($1::text)
      `, [strAction])
      .catch(console.log)
    },

    fetchState: async (roomId: string): Promise<RoomState> => {
      const result = await pool.query(`
        SELECT *
        FROM rooms
        WHERE room_id = $1::text
      `, [roomId])
      if (result.rows.length === 0) return {confirmed: undefined, members: [] as any, lastUpdatedAt: 0}
      const strState = result.rows[0].state
      return JSON.parse(strState)
    },

    stashState: (roomId: string, state: RoomState): void => {
      const strState = JSON.stringify(state)
      pool.query(`
        INSERT INTO rooms (room_id, state)
        VALUES($1::text, $2::text)
        ON CONFLICT (room_id) DO UPDATE
        SET state = $2::text,
            updated_at = NOW()
        WHERE rooms.room_id = $1::text
      `, [roomId, strState])
      .catch(console.log)
    }
  }

  const loadNewActions = async () => {
    const result = await pool.query(`
      SELECT *
      FROM actions
      WHERE action_id > $1::int
    `, [lastActionId])
    result.rows.forEach(row => {
      const action = JSON.parse(row.action)
      action.$timeMs = row.sent_at
      lastActionId = row.action_id
      if (db.onaction) db.onaction(action)
    })
  }

  const removeOldActions = async () => {
    await pool.query(`
      DELETE FROM actions
      WHERE sent_at < NOW() - interval '5 minute'
    `)
  }

  setInterval(loadNewActions, 1000)
  setInterval(removeOldActions, 60000)

  return db
}
