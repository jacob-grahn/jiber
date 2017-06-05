import optimisticActions from './optimistic-actions'
import { OPTIMISTIC_ACTION } from './client-room'
import {
  HopeAction,
  SERVER,
  CLIENT,
  CONFIRMED_ACTION,
  confirmedState
} from '../../../core/index'

test('prune actions that do not have a userId and actionId', () => {
  const actions: any = [
    null,
    false,
    {},
    {$hope: {}},
    {$hope: {actionId: 1}},
    {$hope: {userId: 1}}
  ]
  const action: HopeAction = {
    type: CONFIRMED_ACTION,
    $hope: {
      actionId: 1,
      userId: '',
      roomId: '',
      source: SERVER,
      timeMs: 0
    }
  }
  expect(optimisticActions(actions, action)).toEqual([])
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const actions: any = [
    {$hope: {actionId: 1, userId: 'bob'}},
    {$hope: {actionId: 2, userId: 'bob'}},
    {$hope: {actionId: 3, userId: 'bob'}},
    {$hope: {actionId: 1, userId: 'sue'}}
  ]
  const action: HopeAction = {
    type: CONFIRMED_ACTION,
    $hope: {
      userId: 'bob',
      actionId: 2,
      roomId: '',
      source: SERVER,
      timeMs: 0
    }
  }
  expect(optimisticActions(actions, action)).toEqual([
    {$hope: {actionId: 3, userId: 'bob'}},
    {$hope: {actionId: 1, userId: 'sue'}}
  ])
})

/* test('add userId to actions that do not have one', () => {
  const list: any = [
    {},
    {type: 'WEE', $hope: {actionId: 5}},
    {type: 'WEE', $hope: {userId: 'bob', actionId: 2}}
  ]

  const roomId = 'room 1'
  const result = {
    confirmedState: {},
    actionIds: {bob: 1, sue: 1}
  }
  const action = confirmedState(roomId, result)
  expect(optimisticActions(list, action)).toEqual([
    {type: 'WEE', $hope: {userId: 'sue', actionId: 5}},
    {type: 'WEE', $hope: {userId: 'bob', actionId: 2}}
  ])
}) */

test('remove outdated optimistic actions on join', () => {
  const list: any = [
    {type: 'WEE', $hope: {userId: 'sue', actionId: 5}},
    {type: 'WEE', $hope: {userId: 'sue', actionId: 6}},
    {type: 'WEE', $hope: {userId: 'bob', actionId: 2}}
  ]

  const roomId = 'room 1'
  const result = {
    confirmedState: {},
    actionIds: {sue: 5}
  }
  expect(optimisticActions(list, confirmedState(roomId, result))).toEqual([
    {type: 'WEE', $hope: {userId: 'sue', actionId: 6}}
  ])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action: HopeAction = {
    type: OPTIMISTIC_ACTION,
    value: '123',
    $hope: {
      actionId: 1,
      roomId: '',
      userId: '',
      source: CLIENT,
      timeMs: 0
    }
  }
  const newState = optimisticActions(state, action)
  expect(newState[0].value).toEqual('123')
})