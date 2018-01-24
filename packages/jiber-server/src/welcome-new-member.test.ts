import { OPEN, STATE } from 'jiber-core'
import { welcomeNewMember } from './welcome-new-member'
import { createServerStore } from './server-store'
import * as sinon from 'sinon'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const store = createServerStore({initialState: {
  doc1: 'hello'
}})

let stub: sinon.SinonStub
beforeEach(() => {
  stub = sinon.stub()
  store.socketServer.sendToUser = stub as any
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('ignore actions without a $doc and $uid', () => {
  welcomeNewMember(store, { type: OPEN, $uid: '1234' })
  welcomeNewMember(store, { type: OPEN, $doc: 'doc1' })
  welcomeNewMember(store, { type: OPEN })
  expect(stub.callCount).toBe(0)
})

test('ignore actions other than OPEN', () => {
  welcomeNewMember(store, { type: 'ee', $uid: 'user1', $doc: 'doc1' })
  expect(stub.callCount).toBe(0)
})

test('OPEN actions trigger STATE being sent out', () => {
  welcomeNewMember(store, {
    type: OPEN,
    $uid: 'user1',
    $doc: 'doc1'
  })
  expect(stub.getCall(0).args).toEqual(['user1', {
    type: STATE,
    state: 'hello',
    $doc: 'doc1'
  }])
})

test('non-existant docs are ignored', () => {
  welcomeNewMember(store, {
    type: OPEN,
    $uid: 'user1',
    $doc: '500'
  })
  expect(stub.callCount).toBe(0)
})
