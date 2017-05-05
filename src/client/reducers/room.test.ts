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
    optimistic: undefined
  })
})

test('user generated actions are added to the optimistic stack', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  expect(roomReducer(state, action)).toEqual({
    actions: [{type: 'test', value: '123'}],
    confirmed: undefined,
    memberIds: [],
    optimistic: '123'
  })
})

test('the optimistic state is based on the confirmed state', () => {
  const state: any = {
    actions: [],
    confirmed: 'abc',
    memberIds: [],
    optimistic: ''
  }
  const action: Action = confirmAction('thisRoom', {type: 'test', value: 'def'})
  expect(roomReducer(state, action)).toEqual({
    actions: [],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef'
  })
})

test('optimistic state is recalculated when confirmed state is updated', () => {
  const state: any = {
    actions: [{type: 'test', value: '123'}, {type: 'test', value: '456'}],
    confirmed: 'abc',
    memberIds: [],
    optimistic: 'abc123456'
  }
  const action: Action = confirmAction('thisRoom', {type: 'test', value: 'def'})
  expect(roomReducer(state, action)).toEqual({
    actions: [{type: 'test', value: '123'}, {type: 'test', value: '456'}],
    confirmed: 'abcdef',
    memberIds: [],
    optimistic: 'abcdef123456'
  })
})
