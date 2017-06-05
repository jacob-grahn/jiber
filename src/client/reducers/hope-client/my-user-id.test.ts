import myUserId from './my-user-id'
import { loginResult } from './hope-actions'

test('myUserId is set on join success', () => {
  const state = ''
  const roomId = ''
  const result = {myUserId: 'meeeee'}
  const action = loginResult(result)
  expect(myUserId(state, action)).toEqual('meeeee')
})
