import { members } from './members'
import {
  LEAVE_ROOM,
  JOIN_ROOM,
  CONFIRMED_STATE
} from '../constants/action-types'
import { SERVER } from '../constants/source-types'

test('members are set on join success', () => {
  const state = {}
  const memberList = {ike: {actionId: 3}}
  const action = {type: CONFIRMED_STATE, members: memberList}
  expect(members(state, action)).toEqual({ike: {actionId: 3}})
})

test('add user', () => {
  const state = {}
  const $userId = 'fil'
  const action = {type: JOIN_ROOM, $user: {userId: 'fil', actionId: 7}, $userId}
  expect(members(state, action)).toEqual({fil: {userId: 'fil', actionId: 7}})
})

test('remove actionId', () => {
  const state = {fil: {userId: 'fil', actionId: 1}}
  const $userId = 'fil'
  const action = {type: LEAVE_ROOM, $userId}
  expect(members(state, action)).toEqual({})
})

test('removeing a non-member is ignored', () => {
  const state = {fil: {userId: 'fil', actionId: 1}}
  const $userId = 'pluto'
  const action = {type: LEAVE_ROOM, $userId}
  expect(members(state, action)).toEqual({fil: {userId: 'fil', actionId: 1}})
})

test('actions from the server can update actionId', () => {
  const state = {fil: {userId: 'fil', actionId: 1}}
  const action = {type: 'wee', $userId: 'fil', $actionId: 5, $source: SERVER}
  expect(members(state, action)).toEqual({fil: {userId: 'fil', actionId: 5}})
})

test('actions without $userId are ignored', () => {
  const state = {fil: {userId: 'fil', actionId: 1}}
  const action = {type: 'wee'}
  expect(members(state, action)).toEqual({fil: {userId: 'fil', actionId: 1}})
})
