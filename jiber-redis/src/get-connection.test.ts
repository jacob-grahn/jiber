import { getConnection, closeAllConnections } from './get-connection'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

afterEach(() => {
  closeAllConnections()
})

test('return cached connection for same params', () => {
  const conn1 = getConnection('localhost', 6379, 'fetch')
  const conn2 = getConnection('localhost', 6379, 'fetch')
  expect(conn1).toBe(conn2)
})

test('return different connection for different params', () => {
  const conn1 = getConnection('localhost', 6379, 'fetch')
  const conn2 = getConnection('localhost', 6379, 'subscribe')
  expect(conn1).not.toBe(conn2)
})

test('remove conn if can not connect', async () => {
  const conn1 = getConnection('localhost', 5000, 'fetch')
  await sleep(500) // conn1 will error and be removed...
  const conn2 = getConnection('localhost', 5000, 'fetch')
  expect(conn1).not.toBe(conn2)
})
