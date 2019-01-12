/* global test, expect, afterEach */

import { SocketServer } from './socket-server'
import * as WebSocket from 'ws'
import * as https from 'https'
import * as fs from 'fs'

const connectTest = (server: any, client: any) => {
  return new Promise((resolve: any, reject: any) => {
    client.on('error', (err: any) => {
      server.close()
      client.close()
      reject(err)
    })
    client.on('open', () => {
      expect(client.readyState).toEqual(WebSocket.OPEN)
      server.close()
      client.close()
      resolve()
    })
  })
}

test('Use a custom server with ssl', async () => {
  const webServer = https.createServer({
    cert: fs.readFileSync('./src/server.test.cert'),
    key: fs.readFileSync('./src/server.test.key')
  })
  const server = new SocketServer({ server: webServer })
  webServer.listen(8085)

  const client = new WebSocket.default(
    'wss://localhost:8085',
    { rejectUnauthorized: false }
  )

  await connectTest(server, client)
  await new Promise(resolve => webServer.close(resolve))
})

test('Listen on a given port', async () => {
  const server = new SocketServer({ port: 8080 })
  const client = new WebSocket.default('ws://localhost:8080')
  await connectTest(server, client)
})

test('Allow authorized', async () => {
  const verifyClient = (info: any, done: Function) => {
    info.req.verified = { userId: 'TODO: get rid of this' }
    done('yay')
  }
  const server = new SocketServer({ port: 8081, verifyClient })
  const client = new WebSocket.default('ws://localhost:8081')
  await connectTest(server, client)
})

test('Reject unauthorized', () => {
  const verifyClient = (_info: any, done: Function) => {
    done(false)
  }
  const server = new SocketServer({ port: 8083, verifyClient })
  const client = new WebSocket.default('ws://localhost:8083')

  return new Promise((resolve: any, reject: any) => {
    client.on('error', (err: any) => {
      expect(err.toString()).toContain('(401)')
      server.close()
      client.close()
      resolve()
    })
    client.on('open', () => {
      server.close()
      client.close()
      reject('should not connect')
    })
  })
})

/*
test('Send packets from client to backend', () => {
})

test('Send packets from backend to clients', () => {
})
*/
