import { Action, LOGIN_RESULT } from 'jiber-core'
import { onConnect } from './on-connect'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatch = (action: Action) => calls.push(['dispatch', action])
const socketLookup = {}
const ws: any = {
  on: (_event: string, _cb: any) => undefined
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const request: any = { headers: { 'sec-websocket-key': 'socket1' } }
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('should send login result back to user', () => {
  onConnect(dispatch, socketLookup)(ws, request)
  expect(calls.filter(call => call[0] === 'sendToSocket')).toEqual([
    [
      'sendToSocket',
      'socket1',
      {
        type: LOGIN_RESULT,
        user: { socketId: 'socket1', public: { name: 'sally' } }
      }
    ]
  ])
})
