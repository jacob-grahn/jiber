import { memStorage } from './mem-storage'

const sleep = async (ms: number): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
const storage = memStorage

beforeAll(storage.clear)
afterEach(storage.clear)

test('pushAction', async () => {
  const room = 'memRoom1'
  await storage.pushAction(room, {type: 'one'})
  await storage.pushAction(room, {type: 'two'})
  const actions = await storage.fetchActions(room, 0)
  const [a1, a2] = actions
  expect(actions.length).toBe(2)
  expect(a1.type).toBe('one')
  expect(a2.type).toBe('two')
})

test('getActions should return actions newer than timeMs', async () => {
  const room = 'memRoom2'
  await storage.pushAction(room, {type: 'one'})
  await sleep(5)

  const timeMs = new Date().getTime()
  await storage.pushAction(room, {type: 'two'})

  const allActions = await storage.fetchActions(room, 0)
  const nowActions = await storage.fetchActions(room, timeMs - 1)
  const futureActions = await storage.fetchActions(room, Number.MAX_VALUE)
  expect(allActions.length).toBe(2)
  expect(nowActions.length).toBe(1)
  expect(futureActions.length).toBe(0)
})

test('removeActions should remove actions older than timeMs', async () => {
  const room = 'removeActions'
  await storage.pushAction(room, {type: 'one'})
  await sleep(5)

  const timeMs = new Date().getTime()
  await storage.pushAction(room, {type: 'two'})

  await storage.removeActions(room, timeMs)
  const actions = await storage.fetchActions(room, 0)
  expect(actions.length).toBe(1)
  expect(actions[0].type).toBe('two')
})

test ('setState + getState should return the last saved state', async () => {
  const room = 'room46'
  const roomState = {confirmed: 'hi', members: {}, lastUpdatedAt: 0}
  await storage.storeState(room, roomState)
  const state = await storage.fetchState(room)
  expect(state).toEqual(roomState)
})
