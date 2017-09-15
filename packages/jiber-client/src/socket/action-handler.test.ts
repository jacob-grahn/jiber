import { LOGIN_RESULT, CONFIRMED_STATE } from 'jiber-core'
import { createActionHandler } from './action-handler'

let rejoinCalls: any[]
let resendCalls: any[]

const rejoinRooms = (socket: any) => rejoinCalls.push({socket})
const resendPending = (socket: any, roomId: string) => resendCalls.push({socket, roomId})
const socket = 'fakesocket' as any
const actionHandler = createActionHandler(rejoinRooms, resendPending)

beforeEach(() => {
  rejoinCalls = []
  resendCalls = []
})

test('call rejoinRooms after LOGIN_RESULT', () => {
  actionHandler(socket, {type: LOGIN_RESULT})
  expect(rejoinCalls).toEqual([{socket: 'fakesocket'}])
})

test('call resendPending after CONFIRMED_STATE', () => {
  actionHandler(socket, {type: CONFIRMED_STATE, $roomId: 'abc'})
  expect(resendCalls).toEqual([{socket: 'fakesocket', roomId: 'abc'}])
})

test('ignore CONFIRMED_STATE if there is no roomId', () => {
  actionHandler(socket, {type: CONFIRMED_STATE})
  expect(resendCalls.length).toBe(0)
})

test('ignore other actions', () => {
  actionHandler(socket, {type: 'yayy'})
  expect(rejoinCalls.length).toBe(0)
  expect(resendCalls.length).toBe(0)
})
