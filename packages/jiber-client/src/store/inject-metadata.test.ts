import { injectMetadata } from './inject-metadata'
import { Action, SERVER } from 'jiber-core'
import { createClientStore } from './client-store'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const store = createClientStore({initialState: {
  me: { uid: 'barf' },
  docs: {}
}})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('$user is added to the metadata from self', () => {
  const action: Action = { type: 'test' }
  injectMetadata(store, action)
  expect(action.$user).toEqual({ uid: 'barf' })
})

test('actions from server are not altered', () => {
  const action = { type: 'test', $src: SERVER }
  injectMetadata(store, action)
  expect(action).toEqual(action)
})

test('madeAt is added to the metadata', () => {
  const action: Action = { type: 'test' }
  injectMetadata(store, action)
  expect(action.$madeAt).toBeGreaterThan(0)
})
