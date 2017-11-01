import * as sts from './send-to-socket'
import { sendToUser } from './send-to-user'

const stsa = sts as any
let calls: any[] = []

beforeEach(() => {
  calls = []
  stsa._sendToSocket = sts.sendToSocket
  stsa.sendToSocket = (getState: any, socketId: any, action: any) => {
    calls.push([getState, socketId, action])
  }
})

afterEach(() => {
  stsa._sendToSocket = sts.sendToSocket
})

test('do nothing if user does not exist on server', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {}
    }
  }
  sendToUser(getState, 'user1', { type: 'hi' })
  expect(calls).toEqual([])
})

test('call sendToSocket for user', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {
        user1: { userId: 'user1', socketId: 's1' }
      }
    }
  }
  sendToUser(getState, 'user1', { type: 'hi' })
  expect(calls).toEqual([[
    getState,
    's1',
    { type: 'hi' }
  ]])
})
