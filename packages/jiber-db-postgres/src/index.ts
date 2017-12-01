import { Pool, PoolConfig } from 'pg'
import { DB, RoomState, Action } from 'jiber-core'

export const createDbPostgres = async (config: PoolConfig): Promise<DB> => {
  const pool = new Pool(config)
  await pool.connect()

  pool.query(`
    CREATE TABLE IF NOT EXISTS actions (
      action_id int       NOT NULL AUTO_INCREMENT,
      sent_at   timestamp NOT NULL DEFAULT NOW(),
      action    text      NOT NULL
    )
  `)

  pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id    text      NOT NULL,
      state      text      NOT NULL,
      updated_at timestamp NOT NULL DEFAULT NOW()
    )
  `)

  const db = {

    pushAction: (action: Action): void => {
      const strAction = JSON.stringify(action)
      pool.query(`
        INSERT INTO actions
        SET action = $1::text
      `, [strAction])
      .catch(console.log)
    },

    fetchState: async (roomId: string): Promise<RoomState> => {
      const result = await pool.query(`
        SELECT *
        FROM rooms
        WHERE room_id = $1::text
      `, [roomId])
      const strState = result.rows[0].state
      return JSON.parse(strState)
    },

    stashState: (roomId: string, state: RoomState): void => {
      const strState = JSON.stringify(state)
      pool.query(`
        INSERT INTO rooms
        SET room_id = $1::text,
            state = $2::text
        ON CONFLICT (room_id)
        DO UPDATE
        SET state = $2::text,
            updated_at = NOW()
        WHERE room_id = $1::text
      `, [roomId, strState])
      .catch(console.log)
    },

    onaction: undefined
  }

  return db
}
