/* global test, expect */

import * as WS from 'ws'
import { ConnectionToClient } from './connection-to-client'

test('send a welcome packet when a connection is established', async () => {
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
