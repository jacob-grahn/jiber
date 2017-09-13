import { RoomState } from '../core'
import { ServerState } from '../interfaces/server-state'

export const createGetRoom = (getState: () => ServerState) => {
  return (roomId: string): RoomState => {
    const state = getState()
    return state.rooms[roomId]
  }
}
