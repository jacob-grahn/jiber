import room from './room'
import { serverAction, joinResult } from './room-actions'
import { Action } from '../../../core/index'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const roomReducer = room(adder)

test('defaults to something', () => {
  const state: any = undefined
  const action: Action = {type: 'test'}
  expect(roomReducer(state, action)).toBeTruthy()
})

test('the optimistic state is based on the confirmed state', () => {
  const state: any = {
    optimisticActions: [],
    confirmedState: 'abc',
    memberIds: [],
    optimisticState: ''
  }
  const action: Action = serverAction('thisRoom', {
    userId: 'bob',
    type: 'test',
    value: 'def',
    actionId: 1
  })
  expect(roomReducer(state, action)).toEqual({
    optimisticActions: [],
    confirmed: 'abcdef',
    memberIds: [],
    optimisticState: 'abcdef',
    actionIds: {bob: 1}
  })
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const state: any = {
    actions: [
      {
        userId: 'bob',
        type: 'test',
        value: 'aaa',
        actionId: 1
      },
      {
        userId: 'bob',
        type: 'test',
        value: 'bbb',
        actionId: 2
      },
      {
        userId: 'bob',
        type: 'test',
        value: 'ccc',
        actionId: 3
      }
    ],
    confirmed: 'abc',
    memberIds: [],
    optimistic: ''
  }
  const action: Action = serverAction('thisRoom', {
    userId: 'bob',
    type: 'test',
    value: 'zzz',
    actionId: 2
  })
  expect(roomReducer(state, action)).toEqual({
    optimisticActions: [{
      userId: 'bob',
      type: 'test',
      value: 'ccc',
      actionId: 3
    }],
    confirmedState: 'abczzz',
    memberIds: [],
    optimisticState: 'abczzzccc',
    actionIds: {bob: 2}
  })
})

test('optimistic state is recalculated when confirmed state is updated', () => {
  const state: any = {
    optimisticActions: [
      {actionId: 4, userId: 'sally', type: 'test', value: '123'},
      {actionId: 5, userId: 'sally', type: 'test', value: '456'}
    ],
    confirmedState: 'abc',
    memberIds: [],
    optimisticState: 'abc123456'
  }
  const action: Action = serverAction('thisRoom', {
    userId: 'sally',
    type: 'test',
    value: 'def',
    actionId: 3
  })
  expect(roomReducer(state, action)).toEqual({
    optimisticActions: [
      {actionId: 4, userId: 'sally', type: 'test', value: '123'},
      {actionId: 5, userId: 'sally', type: 'test', value: '456'}
    ],
    confirmedState: 'abcdef',
    memberIds: [],
    optimisticState: 'abcdef123456',
    actionIds: {sally: 3}
  })
})

test('optimistic actions are assigned to your userId on join success', () => {
  const state: any = {
    optimisticActions: [
      {type: 'test', value: '123'},
      {type: 'test', value: '456'},
      {userId: 'roy', type: 'test', value: '789'}
    ]
  }
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
  expect(roomReducer(state, action).optimisticActions).toEqual([
    {userId: 'ike', type: 'test', value: '123'},
    {userId: 'ike', type: 'test', value: '456'},
    {userId: 'roy', type: 'test', value: '789'}
  ])
})

test('state, members, actionIds, and status are set on join success', () => {
  const state: any = undefined
  const roomId = 'aRoom'
  const confirmedState = {score: 8444}
  const myUserId = 'ike'
  const actionIds = {ike: 7, roy: 57}
  const memberIds: any[] = ['ike', 'roy']
  const action: Action = joinResult(
    roomId,
    {
      confirmedState,
      myUserId,
      actionIds,
      memberIds
    }
  )
  expect(roomReducer(state, action)).toEqual({
    optimisticActions: [],
    confirmedState: {score: 8444},
    optimisticState: {score: 8444},
    actionIds: {ike: 7, roy: 57},
    memberIds: ['ike', 'roy'],
    status: 'JOINED',
    myUserId: 'ike'
  })
})
