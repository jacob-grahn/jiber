import { Action } from 'jiber-core'
import { createOnMessage } from './on-message'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let state: any
let calls: any[]
const getState = () => state
const pushAction = (action: Action) => {
  calls.push(['pushAction', action])
}
const sendToSocket = (socketId: string, action: Action) => {
  calls.push(['sendToSocket', socketId, action])
}

////////////////////////////////////////////////////////////////////////////////
// init
////////////////////////////////////////////////////////////////////////////////
const onMessage = createOnMessage(getState, pushAction, sendToSocket)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if userId does not exist', () => {
  state = {
    sockets: {}
  }
  const socketId = 'socket1'
  const message = JSON.stringify({type: 'hi'})
  onMessage(socketId, message)
  expect(calls).toEqual([])
})

test('send an error if message is not valid json', () => {
  state = {
    sockets: {
      socket1: {userId: 'user1'}
    }
  }
  const socketId = 'socket1'
  const message = 'lolIamnotJSON'
  onMessage(socketId, message)
  expect(calls).toEqual([
    ['sendToSocket', 'socket1', 'Unexpected token l in JSON at position 0']
  ])
})

test('pass the action to pushAction', () => {
  state = {
    sockets: {
      socket1: {userId: 'user1'}
    }
  }
  const socketId = 'socket1'
  const message = JSON.stringify({type: 'hi'})
  onMessage(socketId, message)
  expect(calls).toEqual([
    ['pushAction', {type: 'hi', $u: 'user1'}]
  ])
})
