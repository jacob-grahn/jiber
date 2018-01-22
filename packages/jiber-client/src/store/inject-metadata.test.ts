import { injectMetadata } from './inject-metadata'
import { Action, SERVER } from 'jiber-core'

const state = {
  me: { uid: 'bob' },
  s: {
    testDoc: {
      watchers: { bob: { time: 0 } }
    }
  }
}
const store = {
  dispatch: () => 'do nothing',
  getState: () => state,
  subscribe: () => () => 'do nothing'
}

test('$user is added to the metadata from server', () => {
  const action: Action = { type: 'test', $doc: 'testDoc', $uid: 'bob', $src: SERVER }
  injectMetadata(store, action)
  expect(action.$user).toEqual({ actionId: 0, fun: true })
})

test('$user is added to the metadata from self', () => {
  const action: Action = { type: 'test', $doc: 'testDoc' }
  injectMetadata(store, action)
  expect(action.$user).toEqual(state.me)
})

test('timeMs is added to the metadata', () => {
  const action: Action = { type: 'test', $doc: 'testDoc' }
  injectMetadata(store, action)
  expect(action.$timeMs).toBeTruthy()
})

test('actions with existing metadata are not altered', () => {
  const action = { type: 'test', $doc: 'testDoc', $actionId: 5 }
  injectMetadata(store, action)
  expect(action).toEqual(action)
})

test('actionId is added to the metadata', () => {
  const action: Action = { type: 'test', $doc: 'testDoc' }
  injectMetadata(store, action)
  expect(action.$actionId).toBeGreaterThan(0)
})
