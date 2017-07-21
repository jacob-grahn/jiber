import members from './members'
import { confirmedStateAction, joinRoom, leaveRoom } from './room-actions'

test('members are set on join success', () => {
  const state = {}
  const roomId = ''
  const result = {
    confirmed: {},
    members: {ike: {actionId: 3}},
    lastUpdatedAt: 0
  }
  const action = confirmedStateAction(roomId, result)
  expect(members(state, action)).toEqual({ike: {actionId: 3}})
})

test('add actionId', () => {
  const state = {}
  const roomId = ''
  const userId = 'fil'
  const action = joinRoom(roomId)
  action.$hope.userId = userId
  expect(members(state, action)).toEqual({fil: {actionId: 0}})
})

test('adding existing user is ignored', () => {
  const state = {sue: {actionId: 5}}
  const roomId = ''
  const userId = 'sue'
  const action = joinRoom(roomId)
  action.$hope.userId = userId
  expect(members(state, action)).toEqual({sue: {actionId: 5}})
})

test('remove actionId', () => {
  const state = {fil: {actionId: 1}}
  const roomId = ''
  const userId = 'fil'
  const action = leaveRoom(roomId)
  action.$hope.userId = userId
  expect(members(state, action)).toEqual({})
})

test('removeing a non-member is ignored', () => {
  const state = {fil: {actionId: 1}}
  const roomId = ''
  const userId = 'pil'
  const action = leaveRoom(roomId)
  action.$hope.userId = userId
  expect(members(state, action)).toEqual({fil: {actionId: 1}})
})
