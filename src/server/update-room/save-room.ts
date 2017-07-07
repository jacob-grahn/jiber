import noConcurrent from '../utils/no-concurrent'
import ServerState from '../interfaces/server-state'
import { RoomState } from '../../core/interfaces/room-state'

interface Settings {
  snapshotInterval: number,
  storage: {
    removeActions: (roomId: string, maxTimeMs: number) => Promise<void>,
    storeState: (roomId: string, state: RoomState) => Promise<boolean>
  }
}

export default function createSaveRoom (
  getState: () => ServerState,
  settings: Settings
) {
  async function saveRoom (roomId: string) {
    if (!roomId) return
    const state = getState()
    const room = state.rooms[roomId]
    if (!room) return
    await settings.storage.storeState(roomId, room)
    await settings.storage.removeActions(roomId, room.lastUpdatedAt)
    await new Promise(resolve => setTimeout(resolve, settings.snapshotInterval))
  }

  return noConcurrent(saveRoom)
}
