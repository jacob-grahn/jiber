/* global test, expect, afterEach */

import * as WebSocket from 'ws'
import * as https from 'https'
import * as fs from 'fs'
import { SocketServer } from './socket-server'
import { Packet } from './packet'

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

test('Reject unauthorized', async () => {
  const verifyClient = (_info: any, done: Function) => {
    done(false)
  }
  const server = new SocketServer({ port: 8083, verifyClient })
  const client = new WebSocket.default('ws://localhost:8083')

  await new Promise((resolve: any, reject: any) => {
    client.on('error', (err: any) => {
      expect(err.toString()).toContain('(401)')
      resolve()
    })
    client.on('open', () => {
      reject('should not connect')
    })
  })

  server.close()
  client.close()
})

test('Send packets from client to backend', async () => {
  const server = new SocketServer({ port: 8089 })
  const client = new WebSocket.default('ws://localhost:8089')

  client.on('open', () => {
    const packet = new Packet({ payload: 'hi' })
    client.send(JSON.stringify(packet))
  })

  await new Promise((resolve: any) => {
    server.on('packetFromClient', (packet: Packet) => {
      expect(packet.payload).toBe('hi')
      resolve()
    })
  })

  server.close()
  client.close()
})

test('Send packets from backend to clients', async () => {
  const verifyClient = (info: any) => {
    info.req.verified = { userId: 'abcde' }
    return true
  }
  const server = new SocketServer({ port: 8090, verifyClient })
  const client = new WebSocket.default('ws://localhost:8090')

  client.on('open', () => {
    const packet = new Packet({ payload: 'hi' })
    const socketId = 'abcde'
    server.send(socketId, packet)
  })

  await new Promise((resolve: any) => {
    client.on('message', (message: string) => {
      const packet = new Packet(JSON.parse(message))
      expect(packet.payload).toBe('hi')
      resolve()
    })
  })

  server.close()
  client.close()
})
