import { noConcurrent } from '../utils/no-concurrent'
import { RoomState } from '../core'
import { RemoveActions, StoreState } from '../interfaces/storage'

export interface SaveRoomSettings {
  snapshotInterval: number,
  storage: {
    removeActions: RemoveActions,
    storeState: StoreState
  }
}

export const createSaveRoom = (
  getRoomState: (roomId: string) => RoomState,
  settings: SaveRoomSettings
) => {
  const saveRoom = async (roomId: string) => {
    if (!roomId) return
    const roomState = getRoomState(roomId)
    if (!roomState) return
    await settings.storage.storeState(roomId, roomState)
    const minTimeMs = roomState.lastUpdatedAt - (settings.snapshotInterval * 5)
    await settings.storage.removeActions(roomId, minTimeMs)
    await new Promise(resolve => setTimeout(resolve, settings.snapshotInterval))
  }

  return noConcurrent(saveRoom)
}
