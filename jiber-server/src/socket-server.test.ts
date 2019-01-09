/* global test, expect */

import { SocketServer } from './socket-server'
const WebSocket = require('ws')

test('Listen on a given port', () => {
  return new Promise((resolve) => {
    const server = new SocketServer(8080)
    const client = new WebSocket('ws://localhost:8080')

    client.on('open', function open() {
      expect(true).toBeTruthy()
      server.close()
      client.close()
      resolve()
    })
  })
})

test('Use a custom server', () => {
})

test('Authenticate connection attempts', () => {
})

test('Send packets from client to backend', () => {
})

test('Send packets from backend to clients', () => {
})
