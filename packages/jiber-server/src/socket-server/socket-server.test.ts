import * as WebSocket from 'ws'
import { createSocketServer } from './socket-server'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
const ws = WebSocket as any
let calls: any[]
class MockServer {
  constructor (settings: Object) {
    calls.push(['constructor', settings])
  }
  on (eventType: string, handler: Function) {
    calls.push(['on', eventType, handler])
  }
  close () {
    calls.push(['close'])
  }
}
const store = {
  settings: {
    socketPort: 123
  },
  getState: () => 'state'
} as any

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => {
  calls = []
  ws.RealServer = ws.Server
  ws.Server = MockServer
})
afterEach(() => {
  ws.Server = ws.RealServer
  ws.RealServer = undefined
})

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('should set up a start and stop interface', () => {
  const socketServer = createSocketServer(store)
  expect(typeof socketServer.start).toBe('function')
  expect(typeof socketServer.stop).toBe('function')
})

test('start should try to listen on socketPort with onAuthorize', () => {
  const socketServer = createSocketServer(store)
  socketServer.start()
  const constructorCalls = calls.filter(call => call[0] === 'constructor')
  expect(constructorCalls[0][1].port).toEqual(123)
  socketServer.stop()
})

test('start should listen for new connections', () => {
  const socketServer = createSocketServer(store)
  socketServer.start()
  const onCalls = calls.filter(call => call[0] === 'on')
  expect(onCalls[1][1]).toEqual('connection')
  socketServer.stop()
})

test('stop should do nothing if the server is not running', () => {
  const socketServer = createSocketServer(store)
  socketServer.stop()
  socketServer.stop()
  expect(calls.length).toBe(0)
})

test('stop should close the server if it is running', () => {
  const socketServer = createSocketServer(store)
  socketServer.start()
  socketServer.stop()
  const closeCalls = calls.filter(call => call[0] === 'close')
  expect(closeCalls).toEqual([
    ['close']
  ])
})
