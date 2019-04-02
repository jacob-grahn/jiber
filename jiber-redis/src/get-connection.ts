import { default as redis } from 'redis'
import { promisify } from 'util'

export interface RedisConnection {
  xadd: (...params: any) => Promise<any>,
  xread: (...params: any) => Promise<any>,
  close: Function
}

const lookup: {[key: string]: RedisConnection} = {}

export const getConnection = (host: string, port: number, role: string) => {
  const key = `${host}-${port}-${role}`
  const send = lookup[key] || createConnection(host, port, role)
  return send
}

export const closeAllConnections = () => {
  Object.keys(lookup).forEach((key: string) => {
    const conn = lookup[key]
    conn.close()
  })
}

const createConnection = (host: string, port: number, role: string) => {
  // create new redis connection
  const client = redis.createClient({ host, port }) as any

  // promisify
  const conn: RedisConnection = {
    xadd: promisify(client.xadd).bind(client),
    xread: promisify(client.xread).bind(client),
    close: client.quit.bind(client)
  }

  // register the connection for later use
  const key = `${host}-${port}-${role}`
  lookup[key] = conn

  // deregister the connection when it closes
  const close = () => {
    delete lookup[key]
    client.removeAllListeners()
  }
  client.on('end', close)
  client.on('error', close)

  // return the connection
  return conn
}
