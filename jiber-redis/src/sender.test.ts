import { Sender } from './sender'
import { getConnection, closeAllConnections } from './get-connection'

afterEach(() => {
  closeAllConnections()
})

test('send action to stream', async () => {
  const host = 'localhost'
  const port = 6379
  const docId = 'sender-test'
  const sender = new Sender({ host, port, docId })
  const result = await sender.send({ type: 'test-test' })

  const conn = getConnection(host, port, 'test-receiver')
  const readResults: any = await conn.xread('STREAMS', docId, 0)
  const readActions: any = readResults[0][1]
  const readAction: any = JSON.parse(readActions[0][1][1])
  console.log(readAction)

  expect(result).toBeTruthy()
  expect(readResults.length).toBe(1)
  expect(readActions.length).toBe(1)
  expect(readAction.type).toBe('test-test')
})
