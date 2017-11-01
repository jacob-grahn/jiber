import { CLOSE_ROOM } from '../constants/action-types'
import { createRoom } from './room'

const identity = (val: any) => val
const room = createRoom(identity)

test('server-room reducer should manage room state', () => {
  expect(room(undefined, { type: 'something' })).toEqual({
    confirmed: undefined,
    lastUpdatedAt: 0,
    members: {}
  })
})

test('return undefined when the room is closed', () => {
  expect(room({}, { type: CLOSE_ROOM })).toEqual(undefined)
})
