import { LOGIN_RESULT } from 'jiber-core'
import { me } from './me'

test('update account on login success', () => {
  const action = {type: LOGIN_RESULT, user: 'bob'}
  expect(me(undefined, action)).toBe('bob')
})

test('return same state for unrelated actions', () => {
  const action = {type: 'ANOTHER_ACTION', user: 'bob'}
  const state = {userId: 'sue'}
  expect(me(state, action)).toBe(state)
})

test('default to undefined', () => {
  expect(me(undefined, {type: 'whatev'})).toEqual(undefined)
})
