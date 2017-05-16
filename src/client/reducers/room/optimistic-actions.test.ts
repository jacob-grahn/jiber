import optimisticActions from './optimistic-actions'
import { joinResult } from './room-actions'
import { Action, SERVER } from '../../../core/index'

test('prune actions that do not have a userId and actionId', () => {
  const actions: any = [
    null,
    false,
    {},
    {$hope: {}},
    {$hope: {actionId: 1}},
    {$hope: {userId: 1}}
  ]
  const action = {$hope: {source: SERVER}, type: 'test'}
  expect(optimisticActions(actions, action)).toEqual([])
})

test('return actions that match userId and have a greater actionId', () => {
  const actions: any = [
    {$hope: {actionId: 1, userId: 'bob'}},
    {$hope: {actionId: 2, userId: 'bob'}},
    {$hope: {actionId: 3, userId: 'bob'}},
    {$hope: {actionId: 1, userId: 'sue'}}
  ]
  const action = {
    type: 'test',
    $hope: {
      userId: 'bob',
      actionId: 2,
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
  const action: Action = {type: 'test', value: '123', $hope: 'testRoom'}
  const newState = optimisticActions(state, action)
  expect(newState[0].value).toEqual('123')
})

test('optimistic actions are assigned to your userId on join success', () => {
  const state: any = [
    {type: 'test', value: '123'},
    {type: 'test', value: '456'},
    {$hope: {userId: 'roy'}, type: 'test', value: '789'}
  ]
  const roomId = 'aRoom'
  const confirmedState = {}
  const myUserId = 'ike'
  const actionIds = {}
  const memberIds: any[] = []
  const action: Action = joinResult(
    roomId,
    {
      confirmedState,
      myUserId,
      actionIds,
      memberIds
    }
  )
  expect(optimisticActions(state, action)).toEqual([
    {$hope: {userId: 'ike'}, type: 'test', value: '123'},
    {$hope: {userId: 'ike'}, type: 'test', value: '456'},
    {$hope: {userId: 'roy'}, type: 'test', value: '789'}
  ])
})
