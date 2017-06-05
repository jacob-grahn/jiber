import room from './client-room'
import { Action } from '../../../core/index'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const roomReducer = room(adder)

test('defaults to something', () => {
  const state = undefined
  const action = {type: 'test'}
  expect(roomReducer(state, action)).toBeTruthy()
})

test('actions without $hope metadata are ignored', () => {
  const state = 'lolerskates'
  const action = {type: 'test'}
  expect(roomReducer(state, action)).toBe('lolerskates')
})
