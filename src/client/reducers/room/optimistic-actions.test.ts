import optimisticActions from './optimistic-actions'
import { joinResult } from './room-actions'
import { Action, SERVER, CLIENT } from '../../../core/index'
import HopeAction from '../../interfaces/hope-action'

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
    type: 'test',
    $hope: {
      actionId: 1,
      userId: '',
      roomId: '',
      source: SERVER
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
    type: 'test',
    $hope: {
      userId: 'bob',
      actionId: 2,
      roomId: '',
      source: SERVER
    }
  }
  expect(optimisticActions(actions, action)).toEqual([
    {$hope: {actionId: 3, userId: 'bob'}},
    {$hope: {actionId: 1, userId: 'sue'}}
  ])
})

test('add userId to actions that do not have one', () => {
  const list: any = [
    {},
    {type: 'WEE'},
    {type: 'WEE', $hope: {userId: 'bob'}}
  ]

  const roomId = 'room 1'
  const result = {
    confirmedState: {},
    myUserId: 'sue',
    actionIds: {},
    memberIds: []
  }
  expect(optimisticActions(list, joinResult(roomId, result))).toEqual([
    {$hope: {userId: 'sue'}},
    {type: 'WEE', $hope: {userId: 'sue'}},
    {type: 'WEE', $hope: {userId: 'bob'}}
  ])
})

test('user generated actions are added to the optimistic list', () => {
  const state: any = undefined
  const action: HopeAction = {
    type: 'test',
    value: '123',
    $hope: {
      actionId: 1,
      roomId: '',
      userId: '',
      source: CLIENT
    }
  }
  const newState = optimisticActions(state, action)
  expect(newState[0].value).toEqual('123')
})
