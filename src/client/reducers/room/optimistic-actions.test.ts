import optimisticActions from './optimistic-actions'
import { serverAction, clientAction, joinResult } from './room-actions'
import { Action } from '../../../core/index'

test('prune actions that do not have a userId and actionId', () => {
  const actions: any = [
    null,
    false,
    {},
    {actionId: 1},
    {userId: 1}
  ]
  const action = {type: 'test', $hope: {}}
  const sAction = serverAction('testRoom', action)
  expect(optimisticActions(actions, sAction)).toEqual([])
})

test('return actions that match userId and have a greater actionId', () => {
  const actions: any = [
    {$hope: {actionId: 1, userId: 'bob'}},
    {$hope: {actionId: 2, userId: 'bob'}},
    {$hope: {actionId: 3, userId: 'bob'}},
    {$hope: {actionId: 1, userId: 'sue'}}
  ]
  const action = {type: 'test', $hope: {userId: 'bob', actionId: 2}}
  expect(optimisticActions(actions, serverAction('test', action))).toEqual([
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
  const action: Action = {type: 'test', value: '123'}
  const newState = optimisticActions(state, clientAction('testRoom', action))
  expect(newState[0].value).toEqual('123')
})
