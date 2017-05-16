import optimisticStateFactory from './optimistic-state'
import { Action } from '../../../core/index'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimisticState = optimisticStateFactory(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action: Action = {type: 'test', value: '123'}
  const parentState = {
    optimisticActions: [],
    confirmedState: undefined
  }
  expect(optimisticState(parentState, state, action)).toEqual('123')
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
