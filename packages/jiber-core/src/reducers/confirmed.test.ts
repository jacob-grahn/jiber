import { createConfirmed } from './confirmed'
import { Action } from '../interfaces/action'
import { CONFIRMED_STATE } from '../constants/action-types'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('confirmed state is set on join success', () => {
  const state = 'something else'
  const $r = ''
  const action = {type: CONFIRMED_STATE, confirmed: 'hello', $r}
  const confirmed = createConfirmed(adder)
  expect(confirmed(state, action)).toEqual('hello')
})
