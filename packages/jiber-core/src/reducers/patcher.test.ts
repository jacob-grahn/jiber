import { patcher, SET } from './patcher'

test('patch existing state', () => {
  const state = { plates: true }
  const action = { type: SET, set: { bowls: true } }
  expect(patcher(state, action)).toEqual({ plates: true, bowls: true })
})
