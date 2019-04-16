import { StateSaver } from './state-saver'
import { getConnection, closeAllConnections } from './get-connection'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

afterEach(() => {
  closeAllConnections()
})

test('save state to redis', async () => {
  const host = 'localhost'
  const port = 6379
  const maxHistory = 1
  const docId = 'state-saver-test'
  const stateSaver = new StateSaver({ host, port, maxHistory, docId })

  const server = {
    getDoc: (docId: string) => {
      if (docId === 'state-saver-test') {
        return { state: 'idaho' }
      }
    }
  }
  const action = { type: 'potato', time: 12345 }
  stateSaver.onAction(server, action)

  await sleep(100)

  const conn = getConnection(host, port, 'state-saver-test')
  const valueStr: any = await conn.get(`state-${docId}`)
  const value = JSON.parse(valueStr)
  expect(value.state).toBe('idaho')
  expect(value.time).toBe(12345)
})
