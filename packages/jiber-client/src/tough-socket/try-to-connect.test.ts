import { tryToConnect } from './try-to-connect'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let tryCount = 0
class MockWebSocket {
  onclose: any
  onopen: any
  onerror: any

  constructor (url: any, _credential: any) {
    const socket = this
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
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => {
  (global as any).WebSocket = MockWebSocket
  tryCount = 0
})

afterEach(() => {
  (global as any).WebSocket = undefined
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
// todo: redo this test with fake timers
test('retry connection with an incremental backoff', async () => {
  const settings: any = {
    url: 'WORK_AFTER_3_TRIES',
    socketPort: 123,
    credential: '',
    backoffMs: 1
  }
  // const startMs = new Date().getTime()

  const socket = await tryToConnect(settings) // will fail 3 times, then connect
  // const endMs = new Date().getTime()
  // const elapsedMs = endMs - startMs
  // expect(elapsedMs).toBeGreaterThan(5) // 1 + 2 + 3 = 6 ms
  // expect(elapsedMs).toBeLessThan(100) // give it some headroom
  expect(tryCount).toBe(3)
  expect(socket).toBeTruthy()
})
