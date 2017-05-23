import room from './room'
import { joinResult } from './room-actions'
import { Action, CLIENT } from '../../core/index'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const roomReducer = room(adder)

test('defaults to something', () => {
  const state: any = undefined
  const action: Action = {type: 'test'}
  expect(roomReducer(state, action)).toBeTruthy()
})

test('actions without $hope metadata are ignored', () => {
  const state: any = 'lolerskates'
  const action: Action = {type: 'test'}
  expect(roomReducer(state, action)).toBe('lolerskates')
})
