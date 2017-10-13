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
  actionHandler({type: CONFIRMED_STATE, $r: 'abc'})
  expect(resendCalls).toEqual([{roomId: 'abc'}])
})

test('default roomId to empty string', () => {
  actionHandler({type: CONFIRMED_STATE})
  expect(resendCalls).toEqual([{roomId: ''}])
})

test('ignore other actions', () => {
  actionHandler({type: 'yayy'})
  expect(rejoinCalls.length).toBe(0)
  expect(resendCalls.length).toBe(0)
})
