import { JOIN_ROOM } from '../../core/index'
import { createRejoinRooms } from './rejoin-rooms'

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
const rejoinRooms = createRejoinRooms(sendAction, getState)
beforeEach(() => sentActions = [])

test('send a join action for each room in the state', () => {
  state = {
    rooms: {
      room1: {},
      room2: {}
    }
  }

  rejoinRooms(socket)

  expect(sentActions).toEqual([
    ['fakesocket', {type: JOIN_ROOM, $roomId: 'room1'}],
    ['fakesocket', {type: JOIN_ROOM, $roomId: 'room2'}]
  ])
})
