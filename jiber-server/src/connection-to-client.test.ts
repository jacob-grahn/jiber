/* global test, expect */

import * as WS from 'ws'
import { ConnectionToClient } from './connection-to-client'
import { Action } from './action'
import { PACKET_FROM_CLIENT } from './constants'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

test('send a welcome action when a connection is established', async () => {
  const sends: string[] = []
  const socket: any = {
    readyState: WS.OPEN,
    on: () => { /* do nothing */ },
    send: (message: string) => { sends.push(message) }
  }

  const conn = new ConnectionToClient(socket, { name: 'sue' })
  await sleep(10)

  const welcomeAction = JSON.parse(sends[0])

  expect(conn).toBeTruthy()
  expect(sends.length).toBe(1)
  expect(welcomeAction.type).toBe('WELCOME')
  expect(welcomeAction.user).toEqual({ name: 'sue' })
})

test('emit actions from client with user data attached', () => {
  const received: Action[] = []
  let handler: Function = () => { /* do nothing */ }
  const socket: any = {
    readyState: WS.OPEN,
    on: (_eventType: string, func: Function) => { handler = func },
    send: (_message: string) => { /* do nothing */ }
  }

  const conn = new ConnectionToClient(socket, { id: 'abc' })
  conn.on(PACKET_FROM_CLIENT, (action: Action) => { received.push(action) })

  const action = { type: 'test' }
  const message = JSON.stringify(action)
  handler(message)

  expect(received.length).toBe(1)

  const receivedAction = received[0]
  expect(receivedAction.user).toEqual({ id: 'abc' })
  expect(receivedAction.type).toBe('test')
})
