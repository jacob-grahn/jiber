import actionIds from './action-ids'
import { confirmedState, joinRoom, leaveRoom } from './room-actions'

test('actionIds are set on join success', () => {
  const state = {}
  const roomId = ''
  const result = {
    confirmedState: {},
    actionIds: {ike: 3},
    lastUpdatedAt: 0
  }
  const action = confirmedState(roomId, result)
  expect(actionIds(state, action)).toEqual({ike: 3})
})

test('add actionId', () => {
  const state = {}
  const roomId = ''
  const userId = 'fil'
  const action = joinRoom(roomId)
  action.$hope.userId = userId
  expect(actionIds(state, action)).toEqual({fil: 0})
})

test('adding existing user is ignored', () => {
  const state = {sue: 5}
  const roomId = ''
  const userId = 'sue'
  const action = joinRoom(roomId)
  action.$hope.userId = userId
  expect(actionIds(state, action)).toEqual({sue: 5})
})

test('remove actionId', () => {
  const state = {fil: 1}
  const roomId = ''
  const userId = 'fil'
  const action = leaveRoom(roomId)
  action.$hope.userId = userId
  expect(actionIds(state, action)).toEqual({})
})

test('removeing a non-member is ignored', () => {
  const state = {fil: 1}
  const roomId = ''
  const userId = 'pil'
  const action = leaveRoom(roomId)
  action.$hope.userId = userId
  expect(actionIds(state, action)).toEqual({fil: 1})
})
