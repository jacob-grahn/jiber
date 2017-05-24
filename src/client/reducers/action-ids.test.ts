import actionIds from './action-ids'
import { joinResult, addMember, removeMember } from './room-actions'

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

test('add memberId', () => {
  const state = {}
  const roomId = ''
  const userId = 'fil'
  const action = addMember(roomId, userId)
  expect(actionIds(state, action)).toEqual({fil: 0})
})

test('adding existing user is ignored', () => {
  const state = {sue: 5}
  const roomId = ''
  const userId = 'sue'
  const action = addMember(roomId, userId)
  expect(actionIds(state, action)).toEqual({sue: 5})
})

test('remove memberId', () => {
  const state = {fil: 1}
  const roomId = ''
  const userId = 'fil'
  const action = removeMember(roomId, userId)
  expect(actionIds(state, action)).toEqual({})
})

test('removeing a non-member is ignored', () => {
  const state = {fil: 1}
  const roomId = ''
  const userId = 'pil'
  const action = removeMember(roomId, userId)
  expect(actionIds(state, action)).toEqual({fil: 1})
})
