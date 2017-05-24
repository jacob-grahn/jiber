import memberIds from './member-ids'
import { joinResult, addMember, removeMember } from './room-actions'

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

test('add member', () => {
  const state = ['bob']
  const roomId = ''
  const userId = 'gal'
  const action = addMember(roomId, userId)
  expect(memberIds(state, action)).toEqual(['bob', 'gal'])
})

test('remove member', () => {
  const state = ['bob', 'gal']
  const roomId = ''
  const userId = 'gal'
  const action = removeMember(roomId, userId)
  expect(memberIds(state, action)).toEqual(['bob'])
})

test('do not dupliate members', () => {
  const state = ['bob', 'gal']
  const roomId = ''
  const userId = 'bob'
  const action = addMember(roomId, userId)
  expect(memberIds(state, action)).toEqual(['bob', 'gal'])
})
