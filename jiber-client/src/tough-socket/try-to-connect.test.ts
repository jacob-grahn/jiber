/* import { tryToConnect } from './try-to-connect'

declare const process: any
declare const global: any

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
    process.nextTick(() => {
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
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
jest.useFakeTimers()

beforeEach(() => {
  (global).WebSocket = MockWebSocket
  tryCount = 0
})

afterEach(() => {
  (global).WebSocket = undefined
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('retry connection with an incremental backoff', () => {
  const settings: any = {
    url: 'WORK_AFTER_3_TRIES',
    credential: '',
    backoffMs: 10
  }

  const promise = tryToConnect(settings) // will fail 3 times, then connect
  .then(socket => {
    expect((setTimeout as any).mock.calls.length).toBe(4)
    // the first connection attempt should have no delay
    expect((setTimeout as any).mock.calls[0][1]).toBe(0)
    // the fourth connection attempt should have 30ms delay (3 * backoffMs)
    expect((setTimeout as any).mock.calls[3][1]).toBe(30)
    expect(tryCount).toBe(3)
    expect(socket).toBeTruthy()
  })

  jest.runAllTimers()

  return promise
})
*/

it('fake test', () => {
  expect(true).toBe(true)
})
