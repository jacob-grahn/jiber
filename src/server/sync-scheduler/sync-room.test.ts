import { createSyncRoom } from './sync-room'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const updateRoom = (roomId: string) => calls.push(['updateRoom', roomId])
const closeRoom = (roomId: string) => calls.push(['closeRoom', roomId])
const settings = {maxRoomAge: 100, syncInterval: 50} as any

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const syncRoom = createSyncRoom(updateRoom, closeRoom, settings)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if the room is recent', () => {
  const timeMs = new Date().getTime()
  const room = {lastUpdatedAt: timeMs} as any
  syncRoom(room, 'room1')
  expect(calls).toEqual([])
})

test('sync from storage if room has not been updated in a while', () => {
  const timeMs = new Date().getTime()
  const room = {lastUpdatedAt: timeMs - 50} as any
  syncRoom(room, 'room1')
  expect(calls).toEqual([
    ['updateRoom', 'room1']
  ])
})

test('close if room has not been updated in a very long while', () => {
  const timeMs = new Date().getTime()
  const room = {lastUpdatedAt: timeMs - 150} as any
  syncRoom(room, 'room1')
  expect(calls).toEqual([
    ['closeRoom', 'room1']
  ])
})
