import createSendToUser from './send-to-user'

let calledWith: any[] = []
const sendToSocket = (socketId: string, action: Object) => {
  calledWith.push({socketId, action})
}

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
  const sendToUser = createSendToUser(getState, sendToSocket)
  sendToUser('user1', {type: 'hi'})
  expect(calledWith).toEqual([])
})

test('call sendToSocket for user', () => {
  const getState = () => {
    return {
      rooms: {},
      sockets: {},
      users: {
        user1: {socketId: 's1', public: {userId: 'user1'}, private: undefined}
      }
    }
  }
  const sendToUser = createSendToUser(getState, sendToSocket)
  sendToUser('user1', {type: 'hi'})
  expect(calledWith).toEqual([
    {socketId: 's1', action: {type: 'hi'}}
  ])
})
