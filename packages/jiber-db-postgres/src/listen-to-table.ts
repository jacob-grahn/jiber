import { Pool, Notification } from 'pg'

type Handler = (msg: Notification) => any

export const listenToTable = async (pool: Pool, table: string, handler: Handler) => {
  const client = await pool.connect()
  try {
    await client.query(`LISTEN ${table}_insert`)
    client.on('notification', handler)
    client.on('end', () => listenToTable(pool, table, handler))
  } catch (e) {
    throw e
  } finally {
    client.release()
  }
}
