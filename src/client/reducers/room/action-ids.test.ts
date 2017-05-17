import actionIds from './action-ids'
import { joinResult } from './room-actions'

test('memberIds are set on join success', () => {
  const state = {}
  const roomId = ''
  const result = {
    confirmedState: {},
    myUserId: '',
    actionIds: {ike: 3},
    memberIds: []
  }
  const action = joinResult(roomId, result)
  expect(actionIds(state, action)).toEqual({ike: 3})
})
