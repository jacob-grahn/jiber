import { Pool } from 'pg'

export const setupTable = async (pool: Pool, table: string) => {

  const client = await pool.connect()

  try {
    // begin transaction
    await client.query('BEGIN')

    // create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${table} (
        action_id serial    NOT NULL,
        worker_id smallint  NOT NULL,
        sent_at   timestamp NOT NULL DEFAULT NOW(),
        action    jsonb     NOT NULL
      )`
    )

    // notify us whenever a row is inserted
    await client.query(`
      CREATE OR REPLACE FUNCTION ${table}_insert_notify()
      RETURNS trigger AS $$
        BEGIN
        PERFORM pg_notify('${table}_insert', row_to_json(NEW)::text);
        RETURN NEW;
        END;
      $$ LANGUAGE plpgsql`
    )

    // drop the old trigger
    // there is no CREATE OR REPLACE TRIGGER for some reason
    await client.query(`
      DROP TRIGGER ${table}_insert_trigger ON users
    `)

    // trigger
    await client.query(`
      CREATE TRIGGER ${table}_insert_trigger AFTER INSERT ON users
      FOR EACH ROW EXECUTE PROCEDURE ${table}_insert_notify()
    `)

    // done
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
