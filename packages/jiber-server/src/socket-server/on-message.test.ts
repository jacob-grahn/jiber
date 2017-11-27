import { Action } from 'jiber-core'
import { onMessage } from './on-message'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let state: any
let calls: any[]
const store = {
  getState: () => state,
  socketServer: {
    sendToSocket: (socketId: string, action: Action) => {
      calls.push(['sendToSocket', socketId, action])
    }
  },
  db: {
    pushAction: (action: Action) => {
      calls.push(['pushAction', action])
    }
  }
} as any

////////////////////////////////////////////////////////////////////////////////
// init
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if userId does not exist', () => {
  state = {
    sockets: {}
  }
  const socketId = 'socket1'
  const message = JSON.stringify({ type: 'hi' })
  onMessage(store, socketId, message)
  expect(calls).toEqual([])
})

test('send an error if message is not valid json', () => {
  state = {
    sockets: {
      socket1: { userId: 'user1' }
    }
  }
  const socketId = 'socket1'
  const message = 'lolIamnotJSON'
  onMessage(store, socketId, message)
  expect(calls).toEqual([
    ['sendToSocket', 'socket1', 'Unexpected token l in JSON at position 0']
  ])
})

test('pass the action to pushAction', () => {
  state = {
    sockets: {
      socket1: { userId: 'user1' }
    }
  }
  const socketId = 'socket1'
  const message = JSON.stringify({ type: 'hi' })
  onMessage(store, socketId, message)
  expect(calls).toEqual([
    ['pushAction', { type: 'hi', $userId: 'user1' }]
  ])
})
