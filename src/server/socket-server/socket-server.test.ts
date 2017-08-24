import * as WebSocket from 'ws'
import { createSocketServer } from './socket-server'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
const onAuthorize = 'onAuthorize' as any
const onConnect = 'onConnect' as any
const socketPort = 123
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
  const socketServer = createSocketServer(onAuthorize, onConnect, socketPort)
  expect(typeof socketServer.start).toBe('function')
  expect(typeof socketServer.stop).toBe('function')
})

test('start should try to listen on socketPort with onAuthorize', () => {
  const socketServer = createSocketServer(onAuthorize, onConnect, socketPort)
  socketServer.start()
  const constructorCalls = calls.filter(call => call[0] === 'constructor')
  expect(constructorCalls).toEqual([
    ['constructor', {port: socketPort, verifyClient: onAuthorize}]
  ])
})

test('start should listen for new connections', () => {
  const socketServer = createSocketServer(onAuthorize, onConnect, socketPort)
  socketServer.start()
  const onCalls = calls.filter(call => call[0] === 'on')
  expect(onCalls).toEqual([
    ['on', 'connection', onConnect]
  ])
})

test('stop should do nothing if the server is not running', () => {
  const socketServer = createSocketServer(onAuthorize, onConnect, socketPort)
  socketServer.stop()
  socketServer.stop()
  expect(calls.length).toBe(0)
})

test('stop should close the server if it is running', () => {
  const socketServer = createSocketServer(onAuthorize, onConnect, socketPort)
  socketServer.start()
  socketServer.stop()
  const closeCalls = calls.filter(call => call[0] === 'close')
  expect(closeCalls).toEqual([
    ['close']
  ])
})
