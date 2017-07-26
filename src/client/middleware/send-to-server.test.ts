import { Middleware } from '../../core/index'
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

test('ignore actions without metadata', () => {
  sendToServer(store)(next)({type: 'hi'})
  expect(sendCalledWith).toEqual([])
  expect(nextCalledWith).toEqual(['next'])
})

test('ignore actions with an actionId', () => {
  sendToServer(store)(next)({type: 'hi'})
  expect(sendCalledWith).toEqual([])
  expect(nextCalledWith).toEqual(['next'])
})

test('send all other actions', () => {
  sendToServer(store)(next)({type: 'hi', $hope: {roomId: 'room1'}})
  expect(sendCalledWith).toEqual([
    {type: 'hi', $hope: {roomId: 'room1'}}
  ])
  expect(nextCalledWith).toEqual(['next'])
})
