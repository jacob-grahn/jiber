/* global test, expect */

import * as WS from 'ws'
import { ConnectionToClient } from './connection-to-client'
import { Packet } from './packet'

test('send a welcome packet when a connection is established', () => {
  const sends: string[] = []
  const socket: any = {
    readyState: WS.OPEN,
    on: () => { /* do nothing */ },
    send: (message: string) => { sends.push(message) }
  }

  const conn = new ConnectionToClient(socket, { name: 'sue' })
  const welcomePacket = JSON.parse(sends[0])

  expect(conn).toBeTruthy()
  expect(sends.length).toBe(1)
  expect(welcomePacket.type).toBe('WELCOME')
  expect(welcomePacket.user).toEqual({ name: 'sue' })
})

test('emit packets from client', () => {
  const received: Packet[] = []
  let handler: Function = () => { /* do nothing */ }
  const socket: any = {
    readyState: WS.OPEN,
    on: (_eventType: string, func: Function) => { handler = func },
    send: (_message: string) => { /* do nothing */ }
  }

  const conn = new ConnectionToClient(socket, { id: 'abc' })
  conn.on('packetFromClient', (packet: Packet) => { received.push(packet) })

  const packet = { payload: 'test' }
  const message = JSON.stringify(packet)
  handler(message)

  expect(received.length).toBe(1)

  const receivedPacket = received[0]
  expect(receivedPacket.user).toEqual({ id: 'abc' })
  expect(receivedPacket.payload).toBe('test')
})
