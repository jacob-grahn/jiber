import * as redis from 'redis'
import { promisify } from 'util'

const lookup: {[key: string]: Function} = {}

export const getConnection = (host: string, port: number) => {
  const key = `${host}-${port}`
  const send = lookup[key] || createConnection(host, port)
  return send
}

const createConnection = (host: string, port: number) => {
  // create new redis connection
  const client = redis.createClient({ host, port })
  const send: Function = promisify(client.send_command).bind(client)

  // register the connection for later use
  const key = `${host}-${port}`
  lookup[key] = send

  // deregister the connection when it closes
  const close = () => {
    delete lookup[key]
    client.removeAllListeners()
  }
  client.on('end', close)
  client.on('error', close)

  // return the connection
  return send
}
