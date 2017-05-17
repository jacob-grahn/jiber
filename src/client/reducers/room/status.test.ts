import status from './status'
import { joinResult } from './room-actions'
import { JOINED } from './room-states'

test('status is set on join success', () => {
  const state = ''
  const roomId = ''
  const result = {
    confirmedState: {},
    myUserId: '',
    actionIds: {},
    memberIds: []
  }
  const action = joinResult(roomId, result)
  expect(status(state, action)).toEqual(JOINED)
})
