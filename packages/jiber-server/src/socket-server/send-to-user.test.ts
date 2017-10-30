import { sendToUser } from './send-to-user'

let calledWith: any[] = []

beforeEach(() => {
  calledWith = []
})

test('do nothing if user does not exist on server', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {}
    }
  }
  sendToUser(getState, 'user1', {type: 'hi'})
  expect(calledWith).toEqual([])
})

test('call sendToSocket for user', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {
        user1: {userId: 'user1', socketId: 's1'}
      }
    }
  }
  sendToUser(getState, 'user1', {type: 'hi'})
  expect(calledWith).toEqual([
    {socketId: 's1', action: {type: 'hi'}}
  ])
})
