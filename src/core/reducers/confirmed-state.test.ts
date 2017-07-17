import createConfirmedState from './confirmed-state'
import { confirmedState as confirmState } from './room-actions'
import Action from '../interfaces/action'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const confirmedState = createConfirmedState(adder)

test('confirmed state is set on join success', () => {
  const state = 'something else'
  const roomId = ''
  const result = {
    confirmedState: 'hello there',
    members: {},
    lastUpdatedAt: 0
  }
  const action = confirmState(roomId, result)
  expect(confirmedState(state, action)).toEqual('hello there')
})
