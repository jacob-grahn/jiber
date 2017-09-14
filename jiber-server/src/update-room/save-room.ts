import { noConcurrent } from '../utils/no-concurrent'
import { RoomState } from 'jiber-core'
import { StashState } from '../interfaces/db'

export interface SaveRoomSettings {
  snapshotInterval: number,
  db: {
    stashState: StashState
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
    await settings.db.stashState(roomId, roomState)
    await new Promise(resolve => setTimeout(resolve, settings.snapshotInterval))
  }

  return noConcurrent(saveRoom)
}
