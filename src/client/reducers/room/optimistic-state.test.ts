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
