import createRoom from './create-room'

let dispatchCalledWith: any[] = []
const store = {
  dispatch: (action: any) => {
    dispatchCalledWith.push(action)
  },
  getState: () => {
    return {
      rooms: {
        room1: {confirmed: 'one', optimistic: 'two', members: {}}
      },
      users: {},
      lastUpdatedAt: 0
    }
  },
  setMiddleware: () => { /* do nothing */ }
}

beforeEach(() => {
  dispatchCalledWith = []
})

test('auto join room', () => {
  createRoom(store)('room1')
  expect(dispatchCalledWith).toEqual([
    {type: 'hope/JOIN_ROOM', $hope: {roomId: 'room1'}}
  ])
})

test('dispatch actions to roomId', () => {
  const room = createRoom(store)('room1')
  room.dispatch({type: 'hi'})
  expect(dispatchCalledWith).toEqual([
    {type: 'hope/JOIN_ROOM', $hope: {roomId: 'room1'}},
    {type: 'hi', $hope: {roomId: 'room1'}}
  ])
})

test('get confirmed state if it exists', () => {
  const room = createRoom(store)('room1')
  expect(room.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const room = createRoom(store)('room1')
  expect(room.getState()).toBe('two')
})

test('get confirmed returns undefined if room does not exist', () => {
  const room = createRoom(store)('room2')
  expect(room.getConfirmedState()).toBeUndefined()
})

test('get optimistic state returns undefined if room does not exist', () => {
  const room = createRoom(store)('room2')
  expect(room.getState()).toBeUndefined()
})
