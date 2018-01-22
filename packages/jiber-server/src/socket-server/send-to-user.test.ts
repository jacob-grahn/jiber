import * as sinon from 'sinon'
import * as s2s from './send-to-socket'
import { sendToUser } from './send-to-user'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const socketLookup = { 'user1': 'fakesocket' as any }
const action = { type: 'hi' }
let spy: sinon.SinonSpy
beforeEach(() => {
  spy = sinon.spy(s2s, 'sendToSocket')
})

afterEach(() => {
  spy.restore()
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if user does not exist on server', () => {
  sendToUser(socketLookup, 'user2', action)
  expect(spy.callCount).toBe(0)
})

test('call sendToSocket for user', () => {
  sendToUser(socketLookup, 'user1', action)
  expect(spy.getCall(0).args).toEqual(['fakesocket', action])
})
