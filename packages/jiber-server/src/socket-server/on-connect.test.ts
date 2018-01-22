import { LOGIN_RESULT } from 'jiber-core'
import { onConnect } from './on-connect'
import * as sinon from 'sinon'
import * as s2s from './send-to-socket'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
let dispatch: sinon.SinonStub
let spy: sinon.SinonSpy
const socketLookup = {}
const ws: any = {on: () => {/* do nothing */}}
const request: any = { verified: {uid: 'sally'} }

beforeEach(() => {
  dispatch = sinon.stub() as any
  spy = sinon.spy(s2s, 'sendToSocket')
})

afterEach(() => {
  spy.restore()
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('should send login result back to user', () => {
  onConnect(dispatch, socketLookup)(ws, request)
  expect(spy.getCall(0).args).toEqual([
      ws,
      { type: LOGIN_RESULT, user: { uid: 'sally' } }
    ])
})
