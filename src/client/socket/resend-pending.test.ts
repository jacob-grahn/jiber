import { createResendPending } from './resend-pending'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let sentActions: any[]
let state: any
const sendAction = (socket: any, action: any) => {
  sentActions.push([socket, action])
}
const getState = () => state
const socket: any = 'fakesocket'

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const resendPending = createResendPending(sendAction, getState)
beforeEach(() => sentActions = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('do nothing if the room does not exist', () => {
  state = {
    rooms: {
      room1: {}
    }
  }
  const roomId = 'room2'
  resendPending(socket, roomId)
  expect(sentActions.length).toBe(0)
})

test('do nothing if there are no optimistic actions', () => {
  state = {
    rooms: {
      room1: {
        optimisticActions: []
      }
    }
  }
  const roomId = 'room1'
  resendPending(socket, roomId)
  expect(sentActions.length).toBe(0)
})

test('send optimistic actions from the roomId', () => {
  state = {
    rooms: {
      room1: {
        optimisticActions: [{type: 'one'}, {type: 'two'}]
      }
    }
  }
  const roomId = 'room1'
  resendPending(socket, roomId)
  expect(sentActions).toEqual([
    ['fakesocket', {type: 'one'}],
    ['fakesocket', {type: 'two'}]
  ])
})
