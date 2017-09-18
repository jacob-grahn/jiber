import { CLOSE_ROOM } from 'jiber-core'
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

test('return undefined when the room is closed', () => {
  expect(serverRoom({}, {type: CLOSE_ROOM})).toEqual(undefined)
})
