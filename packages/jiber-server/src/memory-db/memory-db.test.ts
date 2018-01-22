import { memoryDB } from './memory-db'

const db = memoryDB

test('pushAction', async () => {
  const $doc = 'memDoc1'
  const events: any = []
  db.onaction = (action) => events.push(action)
  db.dispatch({ type: 'one', $doc })
  db.dispatch({ type: 'two', $doc })
  expect(events.length).toEqual(2)
})
