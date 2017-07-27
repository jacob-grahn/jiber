import { Action } from '../../core/index'
import createOnMessage from './on-message'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let state: any
let calls: any[]
const getState = () => state
const onAction = (userId: string, action: Action) => {
  calls.push(['onAction', userId, action])
}
const sendToSocket = (socketId: string, action: Action) => {
  calls.push(['sendToSocket', socketId, action])
}

////////////////////////////////////////////////////////////////////////////////
// init
////////////////////////////////////////////////////////////////////////////////
const onMessage = createOnMessage(getState, onAction, sendToSocket)
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

test('pass the action to onAction', () => {
  state = {
    sockets: {
      socket1: {userId: 'user1'}
    }
  }
  const socketId = 'socket1'
  const message = JSON.stringify({type: 'hi'})
  onMessage(socketId, message)
  expect(calls).toEqual([
    ['onAction', 'user1', {type: 'hi'}]
  ])
})
