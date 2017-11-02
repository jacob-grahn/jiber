import { Action, CONFIRMED_STATE } from 'jiber-core'
import { ensureRoom } from './ensure-room'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const store: any = {
  dispatch: (action: Action) => calls.push(action),
  getState: () => {
    return {
      rooms: {
        room1: { roomId: 'room1', source: 'store' }
      }
    }
  },
  db: {
    fetchState: async (roomId: string) => {
      if (roomId === 'room2') return { roomId: 'room2', source: 'db' }
      return undefined
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('return state from store if it exists', async () => {
  const room = await ensureRoom(store, 'room1')
  expect(room).toEqual({ roomId: 'room1', source: 'store' })
})

test('return state from db if it exists', async () => {
  const room = await ensureRoom(store, 'room2')
  expect(room).toEqual({ roomId: 'room2', source: 'db' })
  expect(calls).toEqual([{
    type: CONFIRMED_STATE,
    roomId: 'room2',
    source: 'db',
    $r: 'room2'
  }])
})

test('return default if not found in the store or db', async () => {
  const room = await ensureRoom(store, 'room3')
  expect(room).toEqual({ confirmed: undefined, lastUpdatedAt: 0, members: {} })
})
