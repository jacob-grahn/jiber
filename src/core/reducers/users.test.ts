import { ADD_USER } from '../constants/action-types'
import { users } from './users'

test('set up a user dictionary', () => {
  const state = users(undefined, {type: ADD_USER, user: {userId: 'bob'}})
  expect(state).toEqual({bob: {userId: 'bob'}})
})
