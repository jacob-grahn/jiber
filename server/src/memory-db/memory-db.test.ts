import { ACTION_PUSHED } from '../core'
import { memoryDB } from './memory-db'

const db = memoryDB

test('pushAction', async () => {
  const room = 'memRoom1'
  const events: any = []
  db.emitter.on(ACTION_PUSHED, (roomId, action) => {
    events.push([roomId, action])
  })
  await db.pushAction(room, {type: 'one'})
  await db.pushAction(room, {type: 'two'})
  expect(events).toEqual([
    ['memRoom1', {type: 'one'}],
    ['memRoom1', {type: 'two'}]
  ])
})

test ('stashState + fetchState should return the last saved state', async () => {
  const room = 'room46'
  const roomState = {confirmed: 'hi', members: {}, lastUpdatedAt: 0}
  await db.stashState(room, roomState)
  const state = await db.fetchState(room)
  expect(state).toEqual(roomState)
})
