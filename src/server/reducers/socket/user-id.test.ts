import { ADD_USER } from '../../../core/index'
import userId from './user-id'

test('record userId on successful login', () => {
  const state = undefined
  const action = {type: ADD_USER, user: {userId: 'hi'}}
  expect(userId(state, action)).toEqual('hi')
})
