import { Action } from '../../core/index'
import { createTrySocket } from './try-socket'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const tryToConnect = (): any => Promise.resolve('fakesocket')
const onMessage = () => { /* do nothing */ }
const sendAction = (socket: WebSocket, action: Action) => {
  return calls.push([socket, action])
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const socket = createTrySocket(tryToConnect, onMessage, sendAction)
beforeEach(() => calls = [])

it('socket.send should call sendAction', () => {
  socket.send({type: 'hi'})
  expect(calls).toEqual([['fakesocket', {type: 'hi'}]])
})
