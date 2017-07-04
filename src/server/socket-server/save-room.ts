import noConcurrent from '../utils/no-concurrent'
import ServerState from '../interfaces/server-state'
import { RoomState } from '../../core/interfaces/room-state'

export default function createSaveRoom (
  getState: () => ServerState,
  removeActions: (roomId: string, maxTimeMs: number) => Promise<void>,
  setState: (roomId: string, state: RoomState) => Promise<boolean>
) {
  async function saveRoom (roomId: string) {
    const state = getState()
    const room = state.rooms[roomId]
    await setState(roomId, room)
    await removeActions(roomId, room.lastUpdatedAt)
    await new Promise(resolve => setTimeout(resolve, 1000))                     // todo: delay should be customizable
  }

  return noConcurrent(saveRoom)
}
