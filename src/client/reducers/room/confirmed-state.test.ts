import confirmedStateFactory from './confirmed-state'
import { joinResult } from './room-actions'
import { Action } from '../../../core/index'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const confirmedState = confirmedStateFactory(adder)

test('confirmed state is set on join success', () => {
  const state = 'something else'
  const roomId = ''
  const result = {
    confirmedState: 'hello there',
    myUserId: '',
    actionIds: {},
    memberIds: []
  }
  const action = joinResult(roomId, result)
  expect(confirmedState(state, action)).toEqual('hello there')
})
