import storage from './mem-storage'

async function sleep (ms: number): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

beforeAll(storage.clear)
afterEach(storage.clear)

test('addActions', async () => {
  const room = 'memRoom1'
  await storage.addActions(room, [{type: 'one'}, {type: 'two'}])
  await storage.addActions(room, [{type: 'three'}, {type: 'four'}])
  const actions = await storage.getActions(room, 0)
  const [a1, a2, a3, a4] = actions
  expect(actions.length).toBe(4)
  expect(a1.type).toBe('one')
  expect(a2.type).toBe('two')
  expect(a3.type).toBe('three')
  expect(a4.type).toBe('four')
})

test('getActions should return actions newer than timeMs', async () => {
  const room = 'memRoom2'
  await storage.addActions(room, [{type: 'one'}])
  await sleep(5)

  const timeMs = new Date().getTime()
  await storage.addActions(room, [{type: 'two'}])

  const allActions = await storage.getActions(room, 0)
  const nowActions = await storage.getActions(room, timeMs)
  const futureActions = await storage.getActions(room, Number.MAX_VALUE)
  expect(allActions.length).toBe(2)
  expect(nowActions.length).toBe(1)
  expect(futureActions.length).toBe(0)
})

test('removeActions should remove actions older than timeMs', async () => {
  const room = 'removeActions'
  await storage.addActions(room, [{type: 'one'}])
  await sleep(5)

  const timeMs = new Date().getTime()
  await storage.addActions(room, [{type: 'two'}])

  await storage.removeActions(room, timeMs)
  const actions = await storage.getActions(room, 0)
  expect(actions.length).toBe(1)
  expect(actions[0].type).toBe('two')
})

test ('setState + getState should return the last saved state', async () => {
  const room = 'getState'
  await storage.setState(room, 'yay')
  const state = await storage.getState(room)
  expect(state).toBe('yay')
})
