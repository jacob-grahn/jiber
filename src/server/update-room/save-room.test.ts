import createSaveRoom from './save-room'
import { RoomState } from '../../core/index'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const saveRoom = createSaveRoom(getRoomState, settings)

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('it should get the room state and pass it to storage', async () => {
  await saveRoom('room1')
  expect(calledSetState).toEqual({
    roomId: 'room1',
    roomState: {confirmed: 'sue', lastUpdatedAt: 33, members: {}}
  })
  expect(calledRemoveActions).toEqual({roomId: 'room1', timeMs: -4967})         // timeMs here depends on the default setting for snapshotInterval (33 - 5000) === 4967
})
