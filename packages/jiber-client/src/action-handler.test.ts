import { LOGIN_RESULT, CONFIRMED_STATE, JOIN_ROOM } from 'jiber-core'
import { actionHandler } from './action-handler'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let sentActions: any[]
let state: any
const sendAction = (action: any) => {
  sentActions.push(action)
}
const getState = () => state

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => sentActions = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('send a join action for each room in the state', () => {
  state = {
    rooms: {
      room1: {},
      room2: {}
    }
  }

  actionHandler(sendAction, getState, { type: LOGIN_RESULT })

  expect(sentActions).toEqual([
    { type: JOIN_ROOM, $r: 'room1' },
    { type: JOIN_ROOM, $r: 'room2' }
  ])
})

test('do nothing if the room does not exist', () => {
  state = {
    rooms: {
      room1: {}
    }
  }
  const roomId = 'room2'
  actionHandler(sendAction, getState, { type: CONFIRMED_STATE, $r: roomId })
  expect(sentActions.length).toBe(0)
})

test('do nothing if there are no optimistic actions', () => {
  state = {
    rooms: {
      room1: {
        pendingActions: []
      }
    }
  }
  const roomId = 'room1'
  actionHandler(sendAction, getState, { type: CONFIRMED_STATE, $r: roomId })
  expect(sentActions.length).toBe(0)
})

test('send optimistic actions from the roomId', () => {
  state = {
    rooms: {
      room1: {
        pendingActions: [{ type: 'one' }, { type: 'two' }]
      }
    }
  }
  const roomId = 'room1'
  actionHandler(sendAction, getState, { type: CONFIRMED_STATE, $r: roomId })
  expect(sentActions).toEqual([
    { type: 'one' },
    { type: 'two' }
  ])
})
