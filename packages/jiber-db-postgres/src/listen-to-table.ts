import { Pool } from 'pg'

export const listenToTable = async (pool: Pool, table: string) => {
  const client = await pool.connect()
  try {
    await client.query(`LISTEN ${table}_insert`)
    client.on('notification', (msg) => {
        console.log(msg.payload);
    })
    client.on('error', (error) => {
      console.error('This never even runs:', error);
    })
  }
  catch (e) {
    throw e
  }
  finally {
    client.release()
  }
}
