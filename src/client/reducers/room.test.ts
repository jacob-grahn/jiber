import room from './room'
import { confirmAction } from './room'
import { Action } from '../../core/index'

const adder = (state: any = '', action: Action = {}): any => {
  return state + action.value
}
const roomReducer = room(adder)

test ('defaults to something reasonable', () => {
  const state: any = undefined
  const action: Action = undefined
  expect(roomReducer(state, action)).toEqual({
    actions: [],
    confirmed: undefined,
    memberIds: [],
    optimistic: undefined,
    actionCounts: {}
  })
})

test('user generated actions are added to the optimistic stack', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  expect(roomReducer(state, action)).toEqual({
    actions: [{type: 'test', value: '123'}],
    confirmed: undefined,
    memberIds: [],
    optimistic: '123',
    actionCounts: {}
  })
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
    actionCount: 1
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef',
    actionCounts: {bob: 1}
  })
})

test('remove optimistic actions if newer confirmed action is received', () => {
  const state: any = {
    actions: [
      {
        userId: 'bob',
        type: 'test',
        value: 'aaa',
        actionCount: 1
      },
      {
        userId: 'bob',
        type: 'test',
        value: 'bbb',
        actionCount: 2
      },
      {
        userId: 'bob',
        type: 'test',
        value: 'ccc',
        actionCount: 3
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
    actionCount: 2
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [{
      userId: 'bob',
      type: 'test',
      value: 'ccc',
      actionCount: 3
    }],
    confirmed: 'abczzz',
    memberIds: [],
    optimistic: 'abczzzccc',
    actionCounts: {bob: 2}
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
    actionCount: 4
  })
  expect(roomReducer(state, action)).toEqual({
    actions: [{type: 'test', value: '123'}, {type: 'test', value: '456'}],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef123456',
    actionCounts: {sally: 4}
  })
})
