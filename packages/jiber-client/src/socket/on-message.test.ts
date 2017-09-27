import { Action, SERVER } from 'jiber-core'
import { createOnMessage } from './on-message'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatchAction = (action: Action) => {
  calls.push({func: 'dispatchAction', action})
}
const actionHandler = (action: Action) => {
  calls.push({func: 'actionHandler', action})
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
  const event: any = {data: message}
  const action = {type: 'hi', $source: SERVER}
  onMessage(event)
  expect(calls).toEqual([
    {func: 'actionHandler', action},
    {func: 'dispatchAction', action}
  ])
})

test('ignore invalid json', () => {
  const event: any = {data: 'c9hw38w9h#$"'}
  onMessage(event)
  expect(calls).toEqual([])
})
