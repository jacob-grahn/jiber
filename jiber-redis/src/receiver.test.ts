import { Receiver } from './receiver'
import { getConnection, closeAllConnections } from './get-connection'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

afterEach(() => {
  closeAllConnections()
})

test('only fetch new actions', async () => {
  const nextHistory: any[] = []
  const next = (action: any) => {
    nextHistory.push(action)
  }
  const host = 'localhost'
  const port = 6379
  const docId = 'receiver-test'
  const maxHistory = 50
  const receiver = new Receiver({ host, port, docId, maxHistory }, next)
  receiver.start()

  const conn = getConnection(host, port, 'receiver-test-sender')

  const strAction1 = JSON.stringify({ type: 'one' })
  await conn.xadd(docId, 'MAXLEN', '~', maxHistory, '*', 'action', strAction1)

  await sleep(150)

  const strAction2 = JSON.stringify({ type: 'two' })
  await conn.xadd(docId, 'MAXLEN', '~', maxHistory, '*', 'action', strAction2)

  await sleep(150)
  receiver.stop()

  expect(nextHistory.length).toBe(2)
  expect(nextHistory[0].type).toBe('one')
  expect(nextHistory[1].type).toBe('two')
})

test('stop fetching actions', async () => {
  const nextHistory: any[] = []
  const next = (action: any) => {
    nextHistory.push(action)
  }
  const host = 'localhost'
  const port = 6379
  const docId = 'receiver-test-2'
  const maxHistory = 50
  const receiver = new Receiver({ host, port, docId, maxHistory }, next)
  const conn = getConnection(host, port, 'receiver-test-2-sender')

  receiver.start()

  const strAction1 = JSON.stringify({ type: 'one' })
  await conn.xadd(docId, 'MAXLEN', '~', maxHistory, '*', 'action', strAction1)

  await sleep(50)
  receiver.stop()
  const strAction2 = JSON.stringify({ type: 'two' })
  await conn.xadd(docId, 'MAXLEN', '~', maxHistory, '*', 'action', strAction2)

  await sleep(50)
  expect(nextHistory.length).toBe(1)
  expect(nextHistory[0].type).toBe('one')
})
