import { createTryToConnect } from './try-to-connect'

let socket: WebSocket
let tryCount = 0

const createWebSocket = (url: string, _credential: string) => {
  socket = {} as any
  setTimeout(() => {
    if (url.indexOf('BAD_URL') !== -1) {
      socket.onerror({} as any)
    }
    if (url.indexOf('WORK_AFTER_3_TRIES') !== -1) {
      if (tryCount < 3) {
        tryCount++
        socket.onclose({} as any)
      } else {
        socket.onopen({} as any)
      }
    }
  }, 1)
  return socket
}

beforeEach(() => {
  tryCount = 0
})

test('if the connection fails, try again with an incremental backoff', async () => {
  const settings: any = {
    url: 'WORK_AFTER_3_TRIES',
    socketPort: 123,
    credential: '',
    backoffMs: 25
  }
  const tryToConnect = createTryToConnect(createWebSocket, settings)

  const startMs = new Date().getTime()
  const resultSocket = await tryToConnect()                                     // should fail 3 times before connecting
  const endMs = new Date().getTime()
  const elapsedMs = endMs - startMs
  expect(elapsedMs).toBeGreaterThan(150)                                        // 25 + 50 + 75 = 150 ms
  expect(elapsedMs).toBeLessThan(300)                                           // give it some headroom
  expect(tryCount).toBe(3)
  expect(resultSocket).toBeTruthy()
})
