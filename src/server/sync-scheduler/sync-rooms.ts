import { RoomState } from '../../core/index'
import ServerState from '../interfaces/server-state'
import map from '../utils/map'

export default function createSyncRooms (
  getState: () => ServerState,
  syncRoom: (room: RoomState, roomId: string) => void
) {
  return function syncRooms () {
    const state = getState()
    map(state.rooms, syncRoom)
  }
}
