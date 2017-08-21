import { createConfirmed } from './confirmed'
import Action from '../interfaces/action'
import { PATCH, CONFIRMED_STATE } from '../constants/action-types'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('confirmed state is set on join success', () => {
  const state = 'something else'
  const $roomId = ''
  const action = {type: CONFIRMED_STATE, confirmed: 'hello', $roomId}
  const confirmed = createConfirmed(adder)
  expect(confirmed(state, action)).toEqual('hello')
})

test('confirmed state is updated on PATCH actions', () => {
  const state = {}
  const action = {type: PATCH, confirmed: [['SET', 'color', '#831AF8']]}
  const confirmed = createConfirmed(adder)
  expect(confirmed(state, action)).toEqual({color: '#831AF8'})
})
