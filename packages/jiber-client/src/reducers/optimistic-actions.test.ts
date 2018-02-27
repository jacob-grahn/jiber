import { optimisticActions } from './optimistic-actions'
import { STATE, SERVER } from 'jiber-core'

test('prune actions that do not have a uid', () => {
  const actions: any = [{}, { $madeAt: 0 }]
  const action = {
    type: 'lala',
    $userId: '1',
    $src: SERVER
  }
  expect(optimisticActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    { $madeAt: 1, $userId: 'bob' },
    { $madeAt: 2, $userId: 'bob' },
    { $madeAt: 3, $userId: 'bob' },
    { $madeAt: 1, $userId: 'sue' }
  ]
  const action = {
    type: 'wee',
    $userId: 'bob',
    $madeAt: 2,
    $src: SERVER
  }
  expect(optimisticActions(actions, action)).toEqual([
    { $madeAt: 3, $userId: 'bob' },
    { $madeAt: 1, $userId: 'sue' }
  ])
})

test('remove all optimistic actions when STATE is received', () => {
  const list: any = [
    { type: 'WEE', $userId: 'sue', $madeAt: 5 },
    { type: 'WEE', $userId: 'sue', $madeAt: 6 },
    { type: 'WEE', $userId: 'bob', $madeAt: 2 }
  ]
  const action = {
    type: STATE,
    confirmed: {},
    watchers: { sue: { time: 5 } }
  }
  expect(optimisticActions(list, action)).toEqual([])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action = {
    type: 'lasswe',
    value: '123',
    $madeAt: 1
  }
  const newState = optimisticActions(state, action)
  expect(newState[0].value).toEqual('123')
})
