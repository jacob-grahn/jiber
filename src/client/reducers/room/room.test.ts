import room from './room'
import { confirmAction, joinResult } from './room'
import { Action } from '../../../core/index'

const adder = (state: any = '', action: Action = {}): any => {
  return state + action.value
}
const roomReducer = room(adder)

test('defaults to something', () => {
  const state: any = undefined
  const action: Action = undefined
  expect(roomReducer(state, action)).toBeTruthy()
})

test('user generated actions are added to the optimistic stack', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  expect(roomReducer(state, action).actions).toEqual([
    {actionId: 1, type: 'test', value: '123'}
  ])
})

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  expect(roomReducer(state, action).optimistic).toEqual('123')
})

test('the optimistic state is based on the confirmed state', () => {
  const state: any = {
    actions: [],
    confirmed: 'abc',
    memberIds: [],
    optimistic: ''
  }
  const action: Action = confirmAction('thisRoom', {
    userId: 'bob',
    type: 'test',
    value: 'def',
    actionId: 1
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef',
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
  const action: Action = confirmAction('thisRoom', {
    userId: 'bob',
    type: 'test',
    value: 'zzz',
    actionId: 2
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [{
      userId: 'bob',
      type: 'test',
      value: 'ccc',
      actionId: 3
    }],
    confirmed: 'abczzz',
    memberIds: [],
    optimistic: 'abczzzccc',
    actionIds: {bob: 2}
  })
})

test('optimistic state is recalculated when confirmed state is updated', () => {
  const state: any = {
    actions: [{type: 'test', value: '123'}, {type: 'test', value: '456'}],
    confirmed: 'abc',
    memberIds: [],
    optimistic: 'abc123456'
  }
  const action: Action = confirmAction('thisRoom', {
    userId: 'sally',
    type: 'test',
    value: 'def',
    actionId: 4
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [{type: 'test', value: '123'}, {type: 'test', value: '456'}],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef123456',
    actionIds: {sally: 4}
  })
})

test('optimistic actions are assigned to your userId on join success', () => {
  const state: any = {
    actions: [
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
    confirmedState,
    myUserId,
    actionIds,
    memberIds
  )
  expect(roomReducer(state, action).actions).toEqual([
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
    confirmedState,
    myUserId,
    actionIds,
    memberIds
  )
  expect(roomReducer(state, action)).toEqual({
    actions: [],
    confirmed: {score: 8444},
    optimistic: {score: 8444},
    actionIds: {ike: 7, roy: 57},
    memberIds: ['ike', 'roy'],
    status: 'JOINED',
    myUserId: 'ike'
  })
})
