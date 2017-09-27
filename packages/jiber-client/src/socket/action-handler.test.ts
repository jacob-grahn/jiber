import { LOGIN_RESULT, CONFIRMED_STATE } from 'jiber-core'
import { createActionHandler } from './action-handler'

let rejoinCalls: any[]
let resendCalls: any[]

const rejoinRooms = () => rejoinCalls.push({})
const resendPending = (roomId: string) => resendCalls.push({roomId})
const actionHandler = createActionHandler(rejoinRooms, resendPending)

beforeEach(() => {
  rejoinCalls = []
  resendCalls = []
})

test('call rejoinRooms after LOGIN_RESULT', () => {
  actionHandler({type: LOGIN_RESULT})
  expect(rejoinCalls).toEqual([{}])
})

test('call resendPending after CONFIRMED_STATE', () => {
  actionHandler({type: CONFIRMED_STATE, $roomId: 'abc'})
  expect(resendCalls).toEqual([{roomId: 'abc'}])
})

test('ignore CONFIRMED_STATE if there is no roomId', () => {
  actionHandler({type: CONFIRMED_STATE})
  expect(resendCalls.length).toBe(0)
})

test('ignore other actions', () => {
  actionHandler({type: 'yayy'})
  expect(rejoinCalls.length).toBe(0)
  expect(resendCalls.length).toBe(0)
})
