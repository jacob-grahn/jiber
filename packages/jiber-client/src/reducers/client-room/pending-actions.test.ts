import { pendingActions } from './pending-actions'
import { CONFIRMED_STATE } from 'jiber-core'

test('prune actions that do not have a userId and actionId', () => {
  const actions: any = [
    null,
    false,
    {},
    {$id: 0},
    {$u: '1'}
  ]
  const action = {
    type: 'lala',
    $user: {actionId: 1, userId: '1'},
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    {$id: 1, $u: 'bob'},
    {$id: 2, $u: 'bob'},
    {$id: 3, $u: 'bob'},
    {$id: 1, $u: 'sue'}
  ]
  const action = {
    type: 'wee',
    $user: {userId: 'bob', actionId: 2},
    $confirmed: true
  }
  expect(pendingActions(actions, action)).toEqual([
    {$id: 3, $u: 'bob'},
    {$id: 1, $u: 'sue'}
  ])
})

test('remove all optimistic actions when CONFIRMED_STATE is received', () => {
  const list: any = [
    {type: 'WEE', $u: 'sue', $id: 5},
    {type: 'WEE', $u: 'sue', $id: 6},
    {type: 'WEE', $u: 'bob', $id: 2}
  ]
  const action = {
    type: CONFIRMED_STATE,
    confirmed: {},
    members: {sue: {actionId: 5}}
  }
  expect(pendingActions(list, action)).toEqual([])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action = {
    type: 'lasswe',
    value: '123',
    $id: 1
  }
  const newState = pendingActions(state, action)
  expect(newState[0].value).toEqual('123')
})
