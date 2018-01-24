import { sendToDoc } from './send-to-doc'
import { createServerStore } from '../server-store'
import * as s2s from './send-to-socket'
import * as sinon from 'sinon'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const store = createServerStore({initialState: {
  watchers: {
    doc1: {
      user1: {},
      user2: {}
    }
  }
}})
const action = { type: 'hi' }

store.socketServer.socketLookup = {
  user1: 'socket1' as any,
  user2: 'socket2' as any
}

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
test('call sendToSocket for every watcher of a doc', () => {
  sendToDoc(store, 'doc1', action)
  expect(spy.getCall(0).args).toEqual(['socket1', action])
  expect(spy.getCall(1).args).toEqual(['socket2', action])
})

test('do nothing if doc does not exist', () => {
  sendToDoc(store, 'nope', action)
  expect(spy.callCount).toBe(0)
})
