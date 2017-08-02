import { RoomState } from '../../core/index'
import ServerSettings from '../interfaces/server-settings'

export default function createSyncRoom (
  updateRoom: (roomId: string) => void,
  closeRoom: (roomId: string) => void,
  settings: ServerSettings
) {
  return function syncRoom (room: RoomState, roomId: string) {
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
