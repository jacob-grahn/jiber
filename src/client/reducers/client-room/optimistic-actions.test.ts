import optimisticActions from './optimistic-actions'
import { CONFIRM_ACTION, CONFIRMED_STATE } from '../../../core/index'

test('prune actions that do not have a userId and actionId', () => {
  const actions: any = [
    null,
    false,
    {},
    {$actionId: 1},
    {$userId: 1}
  ]
  const action = {
    type: CONFIRM_ACTION,
    action: {
      type: 'lala',
      $actionId: 1,
      $userId: 1
    }
  }
  expect(optimisticActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    {$actionId: 1, $userId: 'bob'},
    {$actionId: 2, $userId: 'bob'},
    {$actionId: 3, $userId: 'bob'},
    {$actionId: 1, $userId: 'sue'}
  ]
  const action = {
    type: CONFIRM_ACTION,
    action: {
      type: 'wee',
      $userId: 'bob',
      $actionId: 2
    }
  }
  expect(optimisticActions(actions, action)).toEqual([
    {$actionId: 3, $userId: 'bob'},
    {$actionId: 1, $userId: 'sue'}
  ])
})

test('remove outdated optimistic actions on join', () => {
  const list: any = [
    {type: 'WEE', $userId: 'sue', $actionId: 5},
    {type: 'WEE', $userId: 'sue', $actionId: 6},
    {type: 'WEE', $userId: 'bob', $actionId: 2}
  ]

  const roomId = 'room 1'
  const confirmed = {}
  const members = {sue: {actionId: 5}}
  const lastUpdatedAt = 0
  const action = {
    type: CONFIRMED_STATE,
    confirmed,
    members,
    lastUpdatedAt,
    $roomId: roomId
  }
  expect(optimisticActions(list, action)).toEqual([
    {type: 'WEE', $userId: 'sue', $actionId: 6}
  ])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action = {
    type: 'lasswe',
    value: '123',
    $actionId: 1
  }
  const newState = optimisticActions(state, action)
  expect(newState[0].value).toEqual('123')
})
