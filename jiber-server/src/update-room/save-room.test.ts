import { createSaveRoom } from './save-room'
import { RoomState } from 'jiber-core'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calledSetState: any
let calledRemoveActions: any

const getRoomState = () => {
  return {confirmed: 'sue', lastUpdatedAt: 33, members: {}}
}

const removeActions = (roomId: string, timeMs: number) => {
  calledRemoveActions = {roomId, timeMs}
  return Promise.resolve()
}

const stashState = (roomId: string, roomState: RoomState) => {
  calledSetState = {roomId, roomState}
  return Promise.resolve()
}

const settings = {
  db: {
    removeActions,
    stashState
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
test('it should get the room state and pass it to db', async () => {
  await saveRoom('room1')
  expect(calledSetState).toEqual({
    roomId: 'room1',
    roomState: {confirmed: 'sue', lastUpdatedAt: 33, members: {}}
  })
  expect(calledRemoveActions).toEqual({roomId: 'room1', timeMs: -4967})         // timeMs here depends on the default setting for snapshotInterval (33 - 5000) === 4967
})
