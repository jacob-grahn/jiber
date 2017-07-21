import { Action, SERVER } from '../../../core/index'
import room from './client-room'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const roomReducer = room(adder)

test('defaults to something', () => {
  const state = undefined
  const action = {type: 'test'}
  expect(roomReducer(state, action)).toBeTruthy()
})

test('actions from the server update confirmed state', () => {
  const state = {
    confirmed: 'yay'
  }
  const action = {
    type: 'test',
    value: 'ok',
    $hope: {source: SERVER, actionId: 1}
  }
  expect(roomReducer(state, action).confirmed).toBe('yayok')
})
