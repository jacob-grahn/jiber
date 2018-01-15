import { pendingActions } from './pending-actions'
import { STATE } from 'jiber-core'

test('prune actions that do not have a userId', () => {
  const actions: any = [{}, { $actionId: 0 }]
  const action = {
    type: 'lala',
    $user: { actionId: 1, userId: '1' },
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    { $actionId: 1, $userId: 'bob' },
    { $actionId: 2, $userId: 'bob' },
    { $actionId: 3, $userId: 'bob' },
    { $actionId: 1, $userId: 'sue' }
  ]
  const action = {
    type: 'wee',
    $userId: 'bob',
    $actionId: 2,
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([
    { $actionId: 3, $userId: 'bob' },
    { $actionId: 1, $userId: 'sue' }
  ])
})

test('remove all optimistic actions when STATE is received', () => {
  const list: any = [
    { type: 'WEE', $userId: 'sue', $actionId: 5 },
    { type: 'WEE', $userId: 'sue', $actionId: 6 },
    { type: 'WEE', $userId: 'bob', $actionId: 2 }
  ]
  const action = {
    type: STATE,
    confirmed: {},
    members: { sue: { actionId: 5 } }
  }
  expect(pendingActions(list, action)).toEqual([])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action = {
    type: 'lasswe',
    value: '123',
    $actionId: 1
  }
  const newState = pendingActions(state, action)
  expect(newState[0].value).toEqual('123')
})
