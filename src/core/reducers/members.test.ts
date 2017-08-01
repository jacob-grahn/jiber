import members from './members'
import {
  LEAVE_ROOM,
  JOIN_ROOM,
  CONFIRMED_STATE
} from '../constants/action-types'

test('members are set on join success', () => {
  const state = {}
  const memberList = {ike: {actionId: 3}}
  const action = {type: CONFIRMED_STATE, members: memberList}
  expect(members(state, action)).toEqual({ike: {actionId: 3}})
})

test('add actionId', () => {
  const state = {}
  const $userId = 'fil'
  const action = {type: JOIN_ROOM, $userId}
  expect(members(state, action)).toEqual({fil: {actionId: 0}})
})

test('adding existing user is ignored', () => {
  const state = {sue: {actionId: 5}}
  const $userId = 'sue'
  const action = {type: JOIN_ROOM, $userId}
  expect(members(state, action)).toEqual({sue: {actionId: 5}})
})

test('remove actionId', () => {
  const state = {fil: {actionId: 1}}
  const $userId = 'fil'
  const action = {type: LEAVE_ROOM, $userId}
  expect(members(state, action)).toEqual({})
})

test('removeing a non-member is ignored', () => {
  const state = {fil: {actionId: 1}}
  const $userId = 'pil'
  const action = {type: LEAVE_ROOM, $userId}
  expect(members(state, action)).toEqual({fil: {actionId: 1}})
})
