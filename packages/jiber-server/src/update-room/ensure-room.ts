import { RoomState, CONFIRMED_STATE } from 'jiber-core'
import { ServerStore } from '../server-store'

const defaultRoomState: RoomState = {
  members: {},
  confirmed: undefined,
  lastUpdatedAt: 0
}

/**
 * if the room does not exist, create a new room using a snapshot from db
 */
export const ensureRoom = async (
  store: ServerStore,
  roomId: string
): Promise<RoomState> => {
  const state = store.getState()
  const roomState = state.rooms[roomId]
  if (roomState) return roomState

  const savedRoomState = await store.db.fetchState(roomId)
  if (savedRoomState) {
    store.dispatch({ ...savedRoomState, type: CONFIRMED_STATE, $roomId: roomId })
    return savedRoomState
  }

  store.dispatch({ ...defaultRoomState, type: CONFIRMED_STATE, $roomId: roomId })
  return defaultRoomState
}
