import { JOIN_ROOM } from 'jiber-core'
import { Room } from './room'

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
  const room = new Room(store, 'room1')
  expect(room).toBeTruthy()
  expect(dispatchCalledWith).toEqual([
    { type: JOIN_ROOM, $roomId: 'room1' }
  ])
})

test('dispatch actions to roomId', () => {
  const room = new Room(store, 'room1')
  room.dispatch({ type: 'hi' })
  expect(dispatchCalledWith).toEqual([
    { type: JOIN_ROOM, $roomId: 'room1' },
    { type: 'hi', $roomId: 'room1' }
  ])
})

test('get confirmed state if it exists', () => {
  const room = new Room(store, 'room1')
  expect(room.getConfirmedState()).toBe('one')
})

test('get optimistic state if it exists', () => {
  const room = new Room(store, 'room1')
  expect(room.getState()).toBe('two')
})

// I think the room should always exist, since the room creates itself
/* test('get confirmed returns undefined if room does not exist', () => {
  const room = new Room(store, 'room2')
  expect(room.getConfirmedState()).toBeUndefined()
})

test('get optimistic state returns undefined if room does not exist', () => {
  const room = new Room(store, 'room2')
  expect(room.getState()).toBeUndefined()
}) */
