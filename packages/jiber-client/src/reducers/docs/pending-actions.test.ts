import { pendingActions } from './pending-actions'
import { STATE } from 'jiber-core'

test('prune actions that do not have a uid', () => {
  const actions: any = [{}, { $actionId: 0 }]
  const action = {
    type: 'lala',
    $user: { actionId: 1, uid: '1' },
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    { $actionId: 1, $uid: 'bob' },
    { $actionId: 2, $uid: 'bob' },
    { $actionId: 3, $uid: 'bob' },
    { $actionId: 1, $uid: 'sue' }
  ]
  const action = {
    type: 'wee',
    $uid: 'bob',
    $actionId: 2,
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([
    { $actionId: 3, $uid: 'bob' },
    { $actionId: 1, $uid: 'sue' }
  ])
})

test('remove all optimistic actions when STATE is received', () => {
  const list: any = [
    { type: 'WEE', $uid: 'sue', $actionId: 5 },
    { type: 'WEE', $uid: 'sue', $actionId: 6 },
    { type: 'WEE', $uid: 'bob', $actionId: 2 }
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
