import { Action, SERVER } from 'jiber-core'
import { createOnMessage } from './on-message'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const socket: any = 'fakesocket'
const dispatchAction = (action: Action) => {
  calls.push({func: 'dispatchAction', action})
}
const actionHandler = (socket: WebSocket, action: Action) => {
  calls.push({func: 'actionHandler', socket, action})
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const onMessage = createOnMessage(dispatchAction, actionHandler)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('call dispatchAction and actionHandler', () => {
  const message = JSON.stringify({type: 'hi'})
  const event: any = {data: message, target: socket}
  const action = {type: 'hi', $source: SERVER}
  onMessage(event)
  expect(calls).toEqual([
    {func: 'actionHandler', action, socket: 'fakesocket'},
    {func: 'dispatchAction', action}
  ])
})

test('ignore invalid json', () => {
  const event: any = {data: 'c9hw38w9h#$"', target: socket}
  onMessage(event)
  expect(calls).toEqual([])
})
