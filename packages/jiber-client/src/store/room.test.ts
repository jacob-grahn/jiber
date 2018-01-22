import { OPEN } from 'jiber-core'
import { Doc } from './'

let dispatchCalledWith: any[] = []
const store = {
  dispatch: (action: any) => {
    dispatchCalledWith.push(action)
  },
  getState: () => {
    return {
      s: {
        1: { confirmed: 'one', optimistic: 'two', members: {} }
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
  const  = new Doc(store, '1')
  expect().toBeTruthy()
  expect(dispatchCalledWith).toEqual([
    { type: OPEN, $doc: '1' }
  ])
})

test('dispatch actions to Id', () => {
  const  = new Doc(store, '1')
  .dispatch({ type: 'hi' })
  expect(dispatchCalledWith).toEqual([
    { type: OPEN, $doc: '1' },
    { type: 'hi', $doc: '1' }
  ])
})

test('get confirmed state if it exists', () => {
  const  = new Doc(store, '1')
  expect(.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const  = new Doc(store, '1')
  expect(.getState()).toBe('two')
})

// I think the  should always exist, since the  creates itself
/* test('get confirmed returns undefined if  does not exist', () => {
  const  = new Doc(store, '2')
  expect(.getConfirmedState()).toBeUndefined()
})

test('get optimistic state returns undefined if  does not exist', () => {
  const  = new Doc(store, '2')
  expect(.getState()).toBeUndefined()
}) */
