import noConcurrent from '../utils/no-concurrent'
import { RoomState } from '../../core/interfaces/room-state'

export interface SaveRoomSettings {
  snapshotInterval: number,
  storage: {
    removeActions: (roomId: string, maxTimeMs: number) => Promise<void>,
    storeState: (roomId: string, state: RoomState) => Promise<boolean>
  }
}

export default function createSaveRoom (
  getRoomState: (roomId: string) => RoomState,
  settings: SaveRoomSettings
) {
  async function saveRoom (roomId: string) {
    if (!roomId) return
    const roomState = getRoomState(roomId)
    if (!roomState) return
    await settings.storage.storeState(roomId, roomState)
    await settings.storage.removeActions(roomId, roomState.lastUpdatedAt)
    await new Promise(resolve => setTimeout(resolve, settings.snapshotInterval))
  }

  return noConcurrent(saveRoom)
}
