import { RoomState } from 'jiber-core'
import { ServerSettings } from '../interfaces/server-settings'

export const createSyncRoom = (
  updateRoom: (roomId: string) => void,
  closeRoom: (roomId: string) => void,
  settings: ServerSettings
) => {
  return (room: RoomState, roomId: string) => {
    const timeMs = new Date().getTime()
    const elapsed = timeMs - room.lastUpdatedAt
    if (elapsed >= settings.maxRoomAge) {
      return closeRoom(roomId)
    }
    if (elapsed >= settings.syncInterval) {
      return updateRoom(roomId)
    }
  }
}
