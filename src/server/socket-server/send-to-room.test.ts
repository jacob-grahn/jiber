import { createSendToRoom } from './send-to-room'

let calledWith: any[] = []
const sendToSocket = (socketId: string, action: Object) => {
  calledWith.push({socketId, action})
}

beforeEach(() => {
  calledWith = []
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
  const sendToRoom = createSendToRoom(getState, sendToSocket)
  sendToRoom('room1', {type: 'hi'})
  expect(calledWith).toEqual([
    {socketId: 's1', action: {type: 'hi'}},
    {socketId: 's2', action: {type: 'hi'}}
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
  const sendToRoom = createSendToRoom(getState, sendToSocket)
  sendToRoom('room1', {type: 'hi'})
  expect(calledWith).toEqual([])
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
  const sendToRoom = createSendToRoom(getState, sendToSocket)
  sendToRoom('room1', {type: 'hi'})
  expect(calledWith).toEqual([
    {socketId: 's2', action: {type: 'hi'}}
  ])
})
