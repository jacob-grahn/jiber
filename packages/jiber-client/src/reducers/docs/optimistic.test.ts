import { Action } from 'jiber-core'
import { createOptimistic } from './optimistic'
import { ClientDocState } from './client-'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimistic = createOptimistic(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action = {
    type: 'bet',
    value: '123',
    $actionId: 1
  }
  const State: ClientDocState = {
    pendingActions: [],
    confirmed: undefined,
    optimistic: state,
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(State, action)).toEqual('123')
})

test('an optimistic action coming in after a confirmed action is ignored', () => {
  const action = {
    type: 'add',
    value: '2',
    $actionId: 5,
    $user: { uid: 'bob', actionId: 5 }
  }
  const State: ClientDocState = {
    pendingActions: [],
    confirmed: '2',
    optimistic: '2',
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(State, action)).toEqual('2')
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const State: ClientDocState = {
    pendingActions: [
      {
        type: 'test',
        value: '123',
        $actionId: 4,
        $uid: 'sally',
        $doc: 'testDoc'
      },
      {
        type: 'test',
        value: '456',
        $actionId: 5,
        $uid: 'sally',
        $doc: 'testDoc'
      }
    ],
    confirmed: 'abc',
    optimistic: '',
    members: {},
    lastUpdatedAt: 0
  }
  const action: Action = {
    type: 'test',
    value: 'abc',
    $doc: 'testDoc',
    $uid: 'sally',
    $actionId: 3,
    $confirmed: true
  }

  const newState = optimistic(State, action)
  expect(newState).toEqual('abc123456')
})

test('do not mutate the original confirmed state', () => {
  const mutateReducer = (state = { count: 0 }) => {
    state.count++
    return state
  }
  const optimistic = createOptimistic(mutateReducer)
  const State: ClientDocState = {
    pendingActions: [
      {
        type: 'test',
        $actionId: 4,
        $uid: 'sally',
        $doc: 'testDoc'
      },
      {
        type: 'test',
        $actionId: 5,
        $uid: 'sally',
        $doc: 'testDoc'
      }
    ],
    confirmed: { count: 5 },
    optimistic: { count: 5 },
    members: {},
    lastUpdatedAt: 0
  }
  const action: Action = {
    type: 'test',
    $doc: 'testDoc',
    $uid: 'sally',
    $actionId: 3,
    $confirmed: true
  }

  const newState = optimistic(State, action)
  expect(newState).toEqual({ count: 7 })
  expect(State.confirmed).toEqual({ count: 5 })
})
