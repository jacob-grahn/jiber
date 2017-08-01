import { Middleware, CLIENT } from '../../core/index'
import createSendToServer from './send-to-server'

let sendCalledWith: any[]
let nextCalledWith: any[]

const send = (action: any) => sendCalledWith.push(action)
const next = () => nextCalledWith.push('next')
const store = {
  getState: () => undefined,
  dispatch: (_action: any) => undefined,
  setMiddleware: (_middleware: any) => undefined
}
const sendToServer: Middleware = createSendToServer(send)

beforeEach(() => {
  sendCalledWith = []
  nextCalledWith = []
})

test('ignore actions where $source !== CLIENT', () => {
  sendToServer(store)(next)({type: 'hi'})
  expect(sendCalledWith).toEqual([])
  expect(nextCalledWith).toEqual(['next'])
})

test('send actions where $source === CLIENT', () => {
  const action = {type: 'hi', $source: CLIENT}
  sendToServer(store)(next)(action)
  expect(sendCalledWith).toEqual([action])
  expect(nextCalledWith).toEqual(['next'])
})
