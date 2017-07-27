import { Action, LOGIN_RESULT, INIT_SOCKET } from '../../core/index'
import createOnConnect from './on-connect'

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
  on: (_event: string, _cb: Function) => undefined
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
    ['sendToSocket', 'socket1', {type: LOGIN_RESULT, user: {name: 'sally'}}]
  ])
})

test('should dispatch an INIT_SOCKET action', () => {
  onConnect(webSocket, request)
  expect(calls.filter(call => call[0] === 'dispatch')[0][1].type)
    .toEqual(INIT_SOCKET)
})
