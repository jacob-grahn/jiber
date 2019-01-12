/* global test, expect, afterEach */

import { SocketServer } from './socket-server'
import * as WebSocket from 'ws'
import * as https from 'https'
import * as fs from 'fs'

test('Listen on a given port', () => {
  return new Promise((resolve) => {
    const server = new SocketServer({ port: 8080 })
    const client = new WebSocket.default('ws://localhost:8080')

    client.on('open', () => {
      expect(client.readyState).toEqual(WebSocket.OPEN)
      server.close()
      client.close()
      resolve()
    })
  })
})

test('Use a custom server with ssl', () => {
  return new Promise((resolve, reject) => {
    const webServer = https.createServer({
      cert: fs.readFileSync('./src/server.test.cert'),
      key: fs.readFileSync('./src/server.test.key')
    })
    const server = new SocketServer({ server: webServer })
    webServer.listen(8081)

    const client = new WebSocket.default(
      'wss://localhost:8081',
      { rejectUnauthorized: false }
    )

    client.on('error', (err: any) => {
      webServer.close()
      server.close()
      client.close()
      reject(err)
    })

    client.on('open', () => {
      expect(client.readyState).toEqual(WebSocket.OPEN)
      webServer.close()
      server.close()
      client.close()
      resolve()
    })
  })
})

/*
test('Authenticate connection attempts', () => {
})

test('Send packets from client to backend', () => {
})

test('Send packets from backend to clients', () => {
})
*/
