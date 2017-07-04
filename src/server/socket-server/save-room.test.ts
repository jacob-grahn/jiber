import createSaveRoom from './save-room'
import { RoomState } from '../../core/index'

let calledSetState: any
let calledRemoveActions: any

function getState () {
  return {
    rooms: {room1: {confirmedState: 'sue', lastUpdatedAt: 33, actionIds: {}}},
    sockets: {},
    users: {}
  }
}

function removeActions (roomId: string, timeMs: number) {
  calledRemoveActions = {roomId, timeMs}
  return Promise.resolve()
}

function setState (roomId: string, roomState: RoomState) {
  calledSetState = {roomId, roomState}
  return Promise.resolve(true)
}

const saveRoom = createSaveRoom(getState, removeActions, setState)

test('it should get the room state and pass it to storage', async () => {
  await saveRoom('room1')
  expect(calledSetState).toEqual({
    roomId: 'room1',
    roomState: {confirmedState: 'sue', lastUpdatedAt: 33, actionIds: {}}
  })
  expect(calledRemoveActions).toEqual({roomId: 'room1', timeMs: 33})
})
