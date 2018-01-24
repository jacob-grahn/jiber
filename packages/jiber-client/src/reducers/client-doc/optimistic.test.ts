import { Action, SERVER } from 'jiber-core'
import { createOptimistic } from './optimistic'
import { ClientDocState } from './client-doc'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimistic = createOptimistic(adder)

test('user generated actions are used on the optimistic state', () => {
  const action = {
    type: 'bet',
    value: '123',
    $madeAt: 1
  }
  const state: ClientDocState = {
    pendingActions: [],
    confirmed: undefined,
    optimistic: undefined,
    watchers: {}
  }
  expect(optimistic(state, action)).toEqual('123')
})

test('an optimistic action coming in after a confirmed action is ignored', () => {
  const action = {
    type: 'add',
    value: '2',
    $madeAt: 5,
    $uid: 'bob'
  }
  const state: ClientDocState = {
    pendingActions: [],
    confirmed: '2',
    optimistic: '2',
    watchers: {
      bob: {
        time: 6,
        user: { uid: 'bob' }
      }
    }
  }
  expect(optimistic(state, action)).toEqual('2')
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const state: ClientDocState = {
    pendingActions: [
      {
        type: 'test',
        value: '123',
        $madeAt: 4,
        $uid: 'sally',
        $doc: 'testDoc'
      },
      {
        type: 'test',
        value: '456',
        $madeAt: 5,
        $uid: 'sally',
        $doc: 'testDoc'
      }
    ],
    confirmed: 'abc',
    optimistic: '',
    watchers: {}
  }
  const action: Action = {
    type: 'test',
    value: 'abc',
    $doc: 'testDoc',
    $madeAt: 3,
    $src: SERVER
  }

  const newState = optimistic(state, action)
  expect(newState).toEqual('abc123456')
})

test('do not mutate the original confirmed state', () => {
  const mutateReducer = (state = { count: 0 }) => {
    state.count++
    return state
  }
  const optimistic = createOptimistic(mutateReducer)
  const state: ClientDocState = {
    pendingActions: [
      {
        type: 'test',
        $madeAt: 4,
        $uid: 'sally',
        $doc: 'testDoc'
      },
      {
        type: 'test',
        $madeAt: 5,
        $uid: 'sally',
        $doc: 'testDoc'
      }
    ],
    confirmed: { count: 5 },
    optimistic: { count: 5 },
    watchers: {}
  }
  const action: Action = {
    type: 'test',
    $doc: 'testDoc',
    $uid: 'sally',
    $madeAt: 3,
    $src: SERVER
  }

  const newState = optimistic(state, action)
  expect(newState).toEqual({ count: 7 })
  expect(state.confirmed).toEqual({ count: 5 })
})
