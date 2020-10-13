/* global test, expect, afterEach */

import * as WebSocket from 'ws'
import * as https from 'https'
import * as fs from 'fs'
import { SocketServer } from './socket-server'
import { Action } from './action'
import { WELCOME, PACKET_FROM_CLIENT } from './constants'

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
      expect(err.toString()).toContain('401')
      resolve()
    })
    client.on('open', () => {
      reject('should not connect')
    })
  })

  server.close()
  client.close()
})

test('Send actions from client to backend', async () => {
  const verifyClient = (info: any) => {
    info.req.verified = { name: 'sally' }
    return true
  }
  const server = new SocketServer({ port: 8089, verifyClient })
  const client = new WebSocket.default('ws://localhost:8089')

  client.on('open', () => {
    const action = new Action({ type: 'hi' })
    client.send(JSON.stringify(action))
  })

  await new Promise((resolve: any) => {
    server.on(PACKET_FROM_CLIENT, (action: Action) => {
      expect(action.type).toBe('hi')
      expect(action.user.name).toBe('sally')
      resolve()
    })
  })

  server.close()
  client.close()
})

test('Send actions from backend to clients', async () => {
  const verifyClient = (info: any) => {
    info.req.verified = { userId: 'abcde' }
    return true
  }
  const server = new SocketServer({ port: 8090, verifyClient })
  const client = new WebSocket.default('ws://localhost:8090')

  await new Promise((resolve: any) => {
    client.on('message', (message: string) => {
      const action = new Action(JSON.parse(message))
      if (action.type === WELCOME) {
        server.send(action.conn, JSON.stringify(new Action({ user: action.user })))
      } else {
        expect(action.user.userId).toBe('abcde')
        resolve()
      }
    })
  })

  server.close()
  client.close()
})
