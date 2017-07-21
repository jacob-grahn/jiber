import createSaveRoom from './save-room'
import { RoomState } from '../../core/index'

let calledSetState: any
let calledRemoveActions: any

function getRoomState () {
  return {confirmed: 'sue', lastUpdatedAt: 33, members: {}}
}

function removeActions (roomId: string, timeMs: number) {
  calledRemoveActions = {roomId, timeMs}
  return Promise.resolve()
}

function storeState (roomId: string, roomState: RoomState) {
  calledSetState = {roomId, roomState}
  return Promise.resolve(true)
}

const settings = {
  storage: {
    removeActions,
    storeState
  },
  snapshotInterval: 1000
}

const saveRoom = createSaveRoom(getRoomState, settings)

test('it should get the room state and pass it to storage', async () => {
  await saveRoom('room1')
  expect(calledSetState).toEqual({
    roomId: 'room1',
    roomState: {confirmed: 'sue', lastUpdatedAt: 33, members: {}}
  })
  expect(calledRemoveActions).toEqual({roomId: 'room1', timeMs: 33})
})
