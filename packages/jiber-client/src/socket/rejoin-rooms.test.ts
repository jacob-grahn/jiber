import { JOIN_ROOM } from 'jiber-core'
import { createRejoinRooms } from './rejoin-rooms'

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
const rejoinRooms = createRejoinRooms(sendAction, getState)
beforeEach(() => sentActions = [])

test('send a join action for each room in the state', () => {
  state = {
    rooms: {
      room1: {},
      room2: {}
    }
  }

  rejoinRooms()

  expect(sentActions).toEqual([
    {type: JOIN_ROOM, $roomId: 'room1'},
    {type: JOIN_ROOM, $roomId: 'room2'}
  ])
})
