import { sendToRoom } from './send-to-room'

let calledWith: any[] = []

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
  sendToRoom(getState, 'room1', {type: 'hi'})
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
  sendToRoom(getState, 'room1', {type: 'hi'})
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
  sendToRoom(getState, 'room1', {type: 'hi'})
  expect(calledWith).toEqual([
    {socketId: 's2', action: {type: 'hi'}}
  ])
})
