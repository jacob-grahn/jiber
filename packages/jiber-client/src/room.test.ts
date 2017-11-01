import { JOIN_ROOM } from 'jiber-core'
import { createCreateRoom } from './room'

let dispatchCalledWith: any[] = []
const store = {
  dispatch: (action: any) => {
    dispatchCalledWith.push(action)
  },
  getState: () => {
    return {
      rooms: {
        room1: { confirmed: 'one', optimistic: 'two', members: {} }
      },
      users: {},
      lastUpdatedAt: 0
    }
  },
  subscribe: () => () => 'do nothing'
} as any

beforeEach(() => {
  dispatchCalledWith = []
})

test('auto join room', () => {
  const createRoom = createCreateRoom(store)
  createRoom('room1')
  expect(dispatchCalledWith).toEqual([
    { type: JOIN_ROOM, $r: 'room1' }
  ])
})

test('dispatch actions to roomId', () => {
  const createRoom = createCreateRoom(store)
  const room = createRoom('room1')
  room.dispatch({ type: 'hi' })
  expect(dispatchCalledWith).toEqual([
    { type: JOIN_ROOM, $r: 'room1' },
    { type: 'hi', $r: 'room1' }
  ])
})

test('get confirmed state if it exists', () => {
  const createRoom = createCreateRoom(store)
  const room = createRoom('room1')
  expect(room.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const createRoom = createCreateRoom(store)
  const room = createRoom('room1')
  expect(room.getState()).toBe('two')
})

test('get confirmed returns undefined if room does not exist', () => {
  const createRoom = createCreateRoom(store)
  const room = createRoom('room2')
  expect(room.getConfirmedState()).toBeUndefined()
})

test('get optimistic state returns undefined if room does not exist', () => {
  const createRoom = createCreateRoom(store)
  const room = createRoom('room2')
  expect(room.getState()).toBeUndefined()
})
