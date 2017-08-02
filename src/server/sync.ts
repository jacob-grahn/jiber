import ServerState from './interfaces/server-state'
import ServerSettings from './interfaces/server-settings'

export default function createSync (
  getState: () => ServerState,
  updateRoom: (roomId: string) => void,
  removeRoom: (roomId: string) => void,
  settings: ServerSettings
) {
  function sync () {
    const state = getState()
    const roomIds = Object.keys(state.rooms)
    const timeMs = new Date().getTime()
    roomIds.forEach(roomId => {
      const room = state.rooms[roomId]
      const elapsed = timeMs - room.lastUpdatedAt
      if (elapsed > settings.maxRoomAge) {
        return removeRoom(roomId)
      }
      if (elapsed >= settings.syncInterval) {
        return updateRoom(roomId)
      }
    })
  }

  function start () {
    setInterval(sync, settings.syncInterval)
  }

  return {
    start
  }
}
