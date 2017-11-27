import { memoryDB } from './memory-db'

const db = memoryDB

test('pushAction', async () => {
  const $roomId = 'memRoom1'
  const events: any = []
  db.onaction = (action) => events.push(action)
  db.pushAction({ type: 'one', $roomId })
  db.pushAction({ type: 'two', $roomId })
  expect(events.length).toEqual(2)
})

test('stashState + fetchState should return the last saved state', async () => {
  const room = 'room46'
  const roomState = { confirmed: 'hi', members: {}, lastUpdatedAt: 0 }
  db.stashState(room, roomState)
  const state = await db.fetchState(room)
  expect(state).toEqual(roomState)
})
