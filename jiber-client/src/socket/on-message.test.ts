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
test('call dispatchAction and then actionHandler', () => {
  const message = JSON.stringify({type: 'hi'})
  const event: any = {data: message, target: socket}
  onMessage(event)
  expect(calls).toEqual([
    {func: 'dispatchAction', action: {type: 'hi', $source: SERVER}},
    {func: 'actionHandler', action: {type: 'hi', $source: SERVER}, socket: 'fakesocket'}
  ])
})

test('ignore invalid json', () => {
  const event: any = {data: 'c9hw38w9h#$"', target: socket}
  onMessage(event)
  expect(calls).toEqual([])
})
