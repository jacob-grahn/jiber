import { OPEN } from 'jiber-core'
import { Doc } from './doc'

let dispatchCalledWith: any[] = []
const store = {
  dispatch: (action: any) => {
    dispatchCalledWith.push(action)
  },
  getState: () => {
    return {
      docs: {
        1: { confirmed: 'one', optimistic: 'two', watchers: {} }
      },
      users: {},
      lastUpdatedAt: 0
    }
  },
  subscribe: () => () => 'do nothing'
} as any

beforeEach(() => {
  dispatchCalledWith = []
})

test('auto join ', () => {
  const doc = new Doc(store, '1')
  expect(doc).toBeTruthy()
  expect(dispatchCalledWith).toEqual([
    { type: OPEN, $doc: '1' }
  ])
})

test('dispatch actions to Id', () => {
  const doc = new Doc(store, '1')
  doc.dispatch({ type: 'hi' })
  expect(dispatchCalledWith).toEqual([
    { type: OPEN, $doc: '1' },
    { type: 'hi', $doc: '1' }
  ])
})

test('get confirmed state if it exists', () => {
  const doc = new Doc(store, '1')
  expect(doc.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const doc = new Doc(store, '1')
  expect(doc.getState()).toBe('two')
})
