import { DocWorker } from './doc-worker'
import { default as redis } from 'redis'
import { promisify } from 'util'
import { closeAllConnections } from './get-connection'


const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

afterEach(() => {
  closeAllConnections()
})

test('save state every X actions', async () => {
  // get doc worker to save state
  const settings = {
    host: '127.0.0.1',
    port: 6379,
    maxHistory: 1,
    docId: 'test-save-state'
  }
  const server = {
    getDoc: () => {
      return { state: 'language' }
    }
  }
  const next = (_action: any) => {}
  const worker = new DocWorker(settings, server, next)
  await sleep(100)

  // push an action into the queue to set the state to 'language'
  const client = redis.createClient({ host: 'localhost', port: 6379 }) as any
  const action = { type: 'SET', path: '', value: 'language' }
  const strAction = JSON.stringify(action)
  const xadd = promisify(client.xadd).bind(client)
  await xadd(
    settings.docId, 'MAXLEN', '~', settings.maxHistory, '*', 'action', strAction
  )
  await sleep(100)

  // grab the value from redis
  const get = promisify(client.get).bind(client)
  const strValue = await get('state-test-save-state')
  const value = JSON.parse(strValue)
  await sleep(100)

  // clean up
  worker.stop()
  client.quit()

  // check the result
  expect(value.state).toEqual('language')
  expect(value.time).toBeGreaterThan(1)
})


test('initail state retrieval', async () => {
  // insert initial state into the db
  const client = redis.createClient({ host: 'localhost', port: 6379 }) as any
  const packed = { state: 'dune', time: 1234 }
  client.set(`state-test-isr`, JSON.stringify(packed))
  client.quit()
  await sleep(100)

  // see if doc worker pulls the state
  let forwardedAction
  const settings = {
    host: '127.0.0.1',
    port: 6379,
    maxHistory: 1000,
    docId: 'test-isr'
  }
  const server = {}
  const next = (action: any) => { forwardedAction = action }
  const worker = new DocWorker(settings, server, next)
  await sleep(100)

  // clean up
  worker.stop()

  // check the result
  expect(forwardedAction).toEqual({
    type: 'SET', path: '', value: 'dune', trust: 2, doc: 'test-isr'
  })
})
