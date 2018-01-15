import { LOGIN_RESULT, STATE, JOIN_ROOM } from 'jiber-core'
import * as sinon from 'sinon'
import { onServerMessage } from './on-server-message'
import { createClientStore } from './client-store'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let store: any
let sunRoom: any
let dispatch: sinon.SinonSpy

beforeEach(() => {
  store = createClientStore()
  sunRoom = store.createRoom('sun')
  dispatch = sinon.spy(store, 'dispatch')
})

afterEach(() => {
  dispatch.restore()
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('send a join action for each room in the state', () => {
  const strAction = JSON.stringify({ type: LOGIN_RESULT })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  const param = dispatch.getCall(0).args[0]
  expect(param.$roomId).toBe('sun')
  expect(param.type).toBe(JOIN_ROOM)
  expect(dispatch.callCount).toBe(2)
})

test('do nothing extra if the STATE room does not exist', () => {
  const strAction = JSON.stringify({ type: STATE, $roomId: 'wowow' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.callCount).toBe(1)
})

test('send optimistic actions from the STATE roomId', () => {
  sunRoom.dispatch({ type: 'TEST_ACTION' })
  const strAction = JSON.stringify({ type: STATE, $roomId: 'sun' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.getCall(0).args[0].type).toBe('TEST_ACTION')
  expect(dispatch.getCall(1).args[0].type).toBe('TEST_ACTION')
  expect(dispatch.getCall(2).args[0].type).toBe(STATE)
  expect(dispatch.callCount).toBe(3)
})
