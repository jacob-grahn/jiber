import myUserId from './my-user-id'
import { joinResult } from './room-actions'

test('myUserId is set on join success', () => {
  const state = ''
  const roomId = ''
  const result = {
    confirmedState: {},
    myUserId: 'meeeee',
    actionIds: {}
  }
  const action = joinResult(roomId, result)
  expect(myUserId(state, action)).toEqual('meeeee')
})
