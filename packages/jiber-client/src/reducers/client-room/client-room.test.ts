import { Action } from 'jiber-core'
import { createClientRoom } from './client-room'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const roomReducer = createClientRoom(adder)

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
    $actionId: 1,
    $confirmed: true
  }
  expect(roomReducer(state, action).confirmed).toBe('yayok')
})
