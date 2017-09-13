import { Action, LEAVE_ROOM, REMOVE_SOCKET } from 'jiber-core'
import { createOnClose } from './on-close'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[] = []
const store = {
  dispatch: (action: Action) => calls.push(['dispatch', action]),
  getState: () => {
    return {
      sockets: {
        socket1: {
          connection: {
            removeAllListeners: () => calls.push(['removeAllListeners'])
          },
          userId: 'user1'
        }
      },
      rooms: {
        room1: {members: {}},
        room2: {members: {'user1': {}, 'user2': {}}},
        room3: {members: {'user1': {}}}
      }
    } as any
  }
}
const pushAction = (roomId: string, action: Action) => {
  calls.push(['pushAction', roomId, action])
  return Promise.resolve()
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const onClose = createOnClose(store, pushAction)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if socket does not exist', () => {
  onClose('socket99')
  expect(calls).toEqual([])
})

test('remove event handlers', () => {
  onClose('socket1')
  expect(calls[0]).toEqual(['removeAllListeners'])
})

test('remove user from member rooms', () => {
  onClose('socket1')
  const dispatchCalls = calls.filter(call => call[0] === 'pushAction')
  expect(dispatchCalls).toEqual([
    [
      'pushAction',
      'room2',
      {type: LEAVE_ROOM, $roomId: 'room2', $userId: 'user1'}
    ],
    [
      'pushAction',
      'room3',
      {type: LEAVE_ROOM, $roomId: 'room3', $userId: 'user1'}
    ]
  ])
})

test('remove the socket from the store', () => {
  onClose('socket1')
  const dispatchCalls = calls.filter(call => call[0] === 'dispatch')
  expect(dispatchCalls).toEqual([
    ['dispatch', {type: REMOVE_SOCKET, socketId: 'socket1'}]
  ])
})
