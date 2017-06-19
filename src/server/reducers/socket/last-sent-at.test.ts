import lastSentAt from './last-sent-at'
import { socketSend } from './socket'

test('default to 0', () => {
  const state = undefined
  const action = {type: 'yo'}
  expect(lastSentAt(state, action)).toBe(0)
})

test('update on send', () => {
  const state = undefined
  const action = socketSend('1')
  expect(lastSentAt(state, action)).toBe(action.timeMs)
})
