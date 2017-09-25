import { Action, LOGIN_RESULT, INIT_SOCKET } from 'jiber-core'
import { createOnConnect } from './on-connect'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let state: any
let calls: any[]
const store: any = {
  getState: () => state,
  dispatch: (action: Action) => calls.push(['dispatch', action])
}
const onMessage = (socketId: string, message: string) => {
  calls.push(['onMessage', socketId, message])
}
const onClose = (socketId: string) => {
  calls.push(['onClose', socketId])
}
const sendToSocket = (socketId: string, action: Action) => {
  calls.push(['sendToSocket', socketId, action])
}
const webSocket: any = {
  on: (_event: string, _cb: any) => undefined
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
state = {
  users: {
    user1: {socketId: 'socket1', public: {name: 'sally'}}
  },
  sockets: {
    socket1: {userId: 'user1'}
  }
}
const request: any = {headers: {'sec-websocket-key': 'socket1'}}
const onConnect = createOnConnect(store, onMessage, onClose, sendToSocket)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('should send login result back to user', () => {
  onConnect(webSocket, request)
  expect(calls.filter(call => call[0] === 'sendToSocket')).toEqual([
    [
      'sendToSocket',
      'socket1',
      {type: LOGIN_RESULT, user: {socketId: 'socket1', public: {name: 'sally'}}}
    ]
  ])
})

test('should dispatch an INIT_SOCKET action', () => {
  onConnect(webSocket, request)
  const releventCalls = calls.filter(call => call[0] === 'dispatch')
  const action = releventCalls[0][1]
  expect(action.type).toEqual(INIT_SOCKET)
  expect(action.ws).toBeTruthy()
})
