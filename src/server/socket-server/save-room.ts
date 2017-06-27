import noConcurrent from '../utils/no-concurrent'
import ServerStore from '../interfaces/server-store'
import Storage from '../interfaces/storage'

export default function createSaveRoom (store: ServerStore, storage: Storage) {
  async function saveRoom (roomId: string) {
    const state = store.getState()
    const room = state.rooms[roomId]
    await storage.setState(roomId, room)
    await storage.removeActions(roomId, room.lastUpdatedAt)
    await new Promise(resolve => setTimeout(resolve, 1000))                     // todo: delay should be customizable
  }

  return noConcurrent(saveRoom)
}
