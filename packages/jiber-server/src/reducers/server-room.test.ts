import { CLEAN_PRIVATE, INJECT_PRIVATE, CLOSE_ROOM } from 'jiber-core'
import { createServerRoom } from './server-room'

const identity = (val: any) => val
const serverRoom = createServerRoom(identity)

test('server-room reducer should manage room state', () => {
  expect(serverRoom(undefined, {type: 'something'})).toEqual({
    confirmed: undefined,
    lastUpdatedAt: 0,
    members: {}
  })
})

test('add private data to confirmed state', () => {
  const state = {
    private: 'private',
    members: 'members',
    confirmed: {}
  }
  expect(serverRoom(state, {type: INJECT_PRIVATE})).toEqual({
    private: 'private',
    members: 'members',
    confirmed: {
      $private: 'private',
      $members: 'members'
    }
  })
})

test('remove private data from confirmed state', () => {
  const state = {
    confirmed: {
      $private: 'private',
      $members: 'members'
    }
  }
  expect(serverRoom(state, {type: CLEAN_PRIVATE})).toEqual({
    confirmed: {},
    members: 'members',
    private: 'private'
  })
})

test('return undefined when the room is closed', () => {
  expect(serverRoom({}, {type: CLOSE_ROOM})).toEqual(undefined)
})
