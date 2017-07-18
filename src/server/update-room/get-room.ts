import { RoomState } from '../../core/index'
import ServerState from '../interfaces/server-state'

export default function (getState: () => ServerState) {
  return function getRoomState (roomId: string): RoomState {
    const state = getState()
    return state.rooms[roomId]
  }
}
