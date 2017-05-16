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
