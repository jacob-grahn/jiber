import { saveRoom } from './save-room'
import { RoomState } from 'jiber-core'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calledSetState: any

const store: any = {
  getState: () => {
    return {
      rooms: {
        room1: { confirmed: 'sue', lastUpdatedAt: 33, members: {} }
      }
    }
  },
  db: {
    stashState: async (roomId: string, roomState: RoomState) => {
      calledSetState = { roomId, roomState }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('it should get the room state and pass it to db', async () => {
  await saveRoom(store, 'room1')
  expect(calledSetState).toEqual({
    roomId: 'room1',
    roomState: { confirmed: 'sue', lastUpdatedAt: 33, members: {} }
  })
})
