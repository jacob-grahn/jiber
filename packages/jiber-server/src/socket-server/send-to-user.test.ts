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
  const socketLookup = {}
  sendToUser(socketLookup, 'user1', { type: 'hi' })
  expect(calls).toEqual([])
})

test('call sendToSocket for user', () => {
  const socketLookup = {
    'user1': {} as any
  }
  sendToUser(socketLookup, 'user1', { type: 'hi' })
  expect(calls).toEqual([[
    's1',
    { type: 'hi' }
  ]])
})
