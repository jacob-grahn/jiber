import { OPEN } from 'jiber-core'
import { Doc } from './doc'
import { createClientStore } from './client-store'

const store = createClientStore({initialState: {
  docs: {
    doc1: { confirmed: 'one', optimistic: 'two', watchers: {} }
  }
}})

test('auto join ', () => {
  const doc = new Doc(store, 'doc2')
  expect(doc).toBeTruthy()
  expect(doc.getState()).toEqual({})
})

test('dispatch actions to docId', () => {
  const doc = new Doc(store, 'doc1')
  doc.dispatch({ type: 'add', key: 'hats', value: 5 })
  expect(doc.getState()).toEqual({hats: 5})
})

test('get confirmed state if it exists', () => {
  const doc = new Doc(store, 'doc1')
  expect(doc.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const doc = new Doc(store, 'doc1')
  expect(doc.getState()).toBe('two')
})
