import confirmed from './confirmed'
import { confirmedStateAction } from './room-actions'
import Action from '../interfaces/action'

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
