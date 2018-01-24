import { LOGIN_RESULT, STATE, OPEN } from 'jiber-core'
import * as sinon from 'sinon'
import { onServerMessage } from './on-server-message'
import { createClientStore } from './client-store'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let store: any
let sunDoc: any
let dispatch: sinon.SinonSpy

beforeEach(() => {
  store = createClientStore()
  sunDoc = store.createDoc('sun')
  dispatch = sinon.spy(store, 'dispatch')
})

afterEach(() => {
  dispatch.restore()
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('send a join action for each doc in the state', () => {
  const strAction = JSON.stringify({ type: LOGIN_RESULT })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  const param = dispatch.getCall(0).args[0]
  expect(param.$doc).toBe('sun')
  expect(param.type).toBe(OPEN)
  expect(dispatch.callCount).toBe(2)
})

test('do nothing extra if the doc does not exist', () => {
  const strAction = JSON.stringify({ type: STATE, $doc: 'wowow' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.callCount).toBe(1)
})

test('send optimistic actions from the docId', () => {
  sunDoc.dispatch({ type: 'TEST_ACTION' })
  expect(dispatch.getCall(0).args[0].type).toBe('TEST_ACTION')

  const strAction = JSON.stringify({ type: STATE, $doc: 'sun' })
  const event: any = { data: strAction }
  onServerMessage(store)(event)
  expect(dispatch.getCall(1).args[0].type).toBe('TEST_ACTION')
  expect(dispatch.getCall(2).args[0].type).toBe(STATE)
  expect(dispatch.callCount).toBe(3)
})
