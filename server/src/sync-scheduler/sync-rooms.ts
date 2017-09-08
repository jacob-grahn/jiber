import { RoomState } from '../core'
import { ServerState } from '../interfaces/server-state'
import { map } from '../utils/map'

export const createSyncRooms = (
  getState: () => ServerState,
  syncRoom: (room: RoomState, roomId: string) => void
) => {
  return () => {
    const state = getState()
    map(state.rooms, syncRoom)
  }
}
