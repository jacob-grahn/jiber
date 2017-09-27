import { createTrySocket } from './try-socket'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const socketMock = {
  readyState: 1,
  OPEN: 1,
  send: (str: string) => calls.push(str)
}
const tryToConnect = (): any => Promise.resolve(socketMock)
const onMessage = () => { /* do nothing */ }

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const socket = createTrySocket(tryToConnect, onMessage)
beforeEach(() => calls = [])

it('socket.send should call sendAction', () => {
  socket.send('hello')
  socket.send('wifey')
  expect(calls).toEqual(['hello', 'wifey'])
})
