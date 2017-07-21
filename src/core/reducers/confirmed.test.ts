import confirmed from './confirmed'
import { confirmedStateAction } from './room-actions'
import Action from '../interfaces/action'
import { PATCH } from '../constants/action-types'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}

test('confirmed state is set on join success', () => {
  const state = 'something else'
  const roomId = ''
  const result = {
    confirmed: 'hello there',
    members: {},
    lastUpdatedAt: 0,
    private: undefined,
    optimistic: undefined
  }
  const action = confirmedStateAction(roomId, result)
  expect(confirmed(adder)(state, action)).toEqual('hello there')
})

test('confirmed state is updated on PATCH actions', () => {
  const state = {}
  const action = {type: PATCH, confirmed: [['SET', 'color', '#831AF8']]}
  expect(confirmed(adder)(state, action)).toEqual({color: '#831AF8'})
})
