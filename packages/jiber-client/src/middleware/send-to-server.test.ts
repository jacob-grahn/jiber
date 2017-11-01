import { Middleware } from 'jiber-core'
import { createSendToServer } from './send-to-server'

let sendCalledWith: any[]
let nextCalledWith: any[]

const send = (action: any) => sendCalledWith.push(action)
const next = () => nextCalledWith.push('next')
const store = {
  getState: () => undefined,
  dispatch: (_action: any) => undefined,
  subscribe: () => () => 'do nothing'
}
const sendToServer: Middleware = createSendToServer(send)

beforeEach(() => {
  sendCalledWith = []
  nextCalledWith = []
})

test('send actions where $confirmed is falsy', () => {
  const action = { type: 'hi' }
  sendToServer(store)(next)(action)
  expect(sendCalledWith).toEqual([action])
  expect(nextCalledWith).toEqual(['next'])
})

test('ignore actions where $confirmed is truthy', () => {
  const action = { type: 'hi', $confirmed: true }
  sendToServer(store)(next)(action)
  expect(sendCalledWith).toEqual([])
  expect(nextCalledWith).toEqual(['next'])
})
