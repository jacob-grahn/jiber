import lastReceivedAt from './last-received-at'
import { socketReceive } from './socket'

test('default to 0', () => {
  const state = undefined
  const action = {type: 'yo'}
  expect(lastReceivedAt(state, action)).toBe(0)
})

test('update on send', () => {
  const state = undefined
  const action = socketReceive('1')
  expect(lastReceivedAt(state, action)).toBe(action.timeMs)
})
