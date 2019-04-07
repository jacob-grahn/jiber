import { default as redis } from 'redis'
import { promisify } from 'util'

export interface RedisConnection {
  xadd: (...params: any) => Promise<any>,
  xread: (...params: any) => Promise<any>,
  set: (...params: any) => Promise<any>,
  get: (...params: any) => Promise<any>,
  close: Function
}

const lookup: {[key: string]: RedisConnection} = {}
const retryStrategy = (options: any) => new Error(options.error) // never try to re-connect

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
  const client = redis.createClient({ host, port, retry_strategy: retryStrategy }) as any

  // deregister the connection when it closes
  const close = () => {
    delete lookup[key]
    client.removeAllListeners()
    client.quit()
  }
  client.on('end', close)
  client.on('error', close)

  // promisify
  const conn: RedisConnection = {
    xadd: promisify(client.xadd).bind(client),
    xread: promisify(client.xread).bind(client),
    set: promisify(client.set).bind(client),
    get: promisify(client.get).bind(client),
    close
  }

  // register the connection for later use
  const key = `${host}-${port}-${role}`
  lookup[key] = conn

  // return the connection
  return conn
}
