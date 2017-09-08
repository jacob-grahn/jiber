import { INIT_SOCKET } from '../../../core/index'
import { connectedAt } from './connected-at'

test('default to 0', () => {
  const state = undefined
  const action = {type: 'HI THERE!'}
  expect(connectedAt(state, action)).toEqual(0)
})

test('update on connection', () => {
  const state = undefined
  const timeMs = new Date().getTime()
  const action = {type: INIT_SOCKET, timeMs}
  expect(connectedAt(state, action)).toEqual(action.timeMs)
})
