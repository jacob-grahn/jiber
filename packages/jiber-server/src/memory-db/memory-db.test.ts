import { memoryDB } from './memory-db'

const db = memoryDB

test('pushAction', async () => {
  const $roomId = 'memRoom1'
  const events: any = []
  db.onaction = (action) => events.push(action)
  db.dispatch({ type: 'one', $roomId })
  db.dispatch({ type: 'two', $roomId })
  expect(events.length).toEqual(2)
})
