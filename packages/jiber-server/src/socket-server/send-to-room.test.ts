import { sendToRoom } from './send-to-room'
import * as sts from './send-to-socket'

const stsa = sts as any
let calls: any[] = []

beforeEach(() => {
  calls = []
  stsa._sendToSocket = sts.sendToSocket
  stsa.sendToSocket = (getState: any, socketId: any, action: any) => {
    calls.push([getState, socketId, action])
  }
})

afterEach(() => {
 stsa._sendToSocket = sts.sendToSocket
})

test('call sendToSocket for every member of a room', () => {
  const getState = () => {
    return {
      rooms: {
        room1: {
          members: {
            user1: {userId: 'user1', actionId: 0},
            user2: {userId: 'user2', actionId: 0}
          },
          confirmed: undefined,
          lastUpdatedAt: 0
        }
      },
      sockets: {},
      users: {
        user1: {userId: 'user1', socketId: 's1'},
        user2: {userId: 'user1', socketId: 's2'}
      }
    }
  }
  sendToRoom(getState, 'room1', {type: 'hi'})
  expect(calls).toEqual([
    [getState, 's1', {type: 'hi'}],
    [getState, 's2', {type: 'hi'}]
  ])
})

test('do nothing if room does not exist', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {}
    }
  }
  sendToRoom(getState, 'room1', {type: 'hi'})
  expect(calls).toEqual([])
})

test('only send to users that exist', () => {
  const getState = () => {
    return {
      rooms: {
        room1: {
          members: {
            user1: {userId: 'user1', actionId: 0},
            user2: {userId: 'user2', actionId: 0}
          },
          confirmed: undefined,
          lastUpdatedAt: 0
        }
      },
      sockets: {},
      users: {
        user2: {userId: 'user2', socketId: 's2'}
      }
    }
  }
  sendToRoom(getState, 'room1', {type: 'hi'})
  expect(calls).toEqual([
    [getState, 's2', {type: 'hi'}]
  ])
})
