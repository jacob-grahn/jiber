import memberIds from './member-ids'
import { joinResult } from './room-actions'

test('memberIds are set on join success', () => {
  const state: string[] = []
  const roomId = ''
  const result = {
    confirmedState: {},
    myUserId: '',
    actionIds: {},
    memberIds: ['ike', 'roy']
  }
  const action = joinResult(roomId, result)
  expect(memberIds(state, action)).toEqual(['ike', 'roy'])
})
