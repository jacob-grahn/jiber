import { user } from './user'
import { ADD_USER, REMOVE_USER } from '../constants/action-types'

test('default to obj with empty userId', () => {
  const state = undefined
  const action = {type: 'wee'}
  expect(user(state, action)).toEqual({userId: ''})
})

test('copy user data on ADD_USER', () => {
  const state = undefined
  const action = {type: ADD_USER, user: {userId: 'sue'}}
  expect(user(state, action)).toEqual({userId: 'sue'})
})

test('empty out data on REMOVE_USER', () => {
  const state = {userId: 'sue', age: 50}
  const action = {type: REMOVE_USER, user: {userId: 'sue'}}
  expect(user(state, action)).toEqual({userId: ''})
})
