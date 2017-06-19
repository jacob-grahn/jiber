import { addUser } from '../../../core/index'
import userId from './user-id'

test('record userId on successful login', () => {
  const state = undefined
  const action = addUser({userId: 'hi'})
  expect(userId(state, action)).toEqual('hi')
})
