import noConcurrent from '../utils/no-concurrent'
import ServerState from '../interfaces/server-state'
import { RoomState } from '../../core/interfaces/room-state'

export default function createSaveRoom (
  getState: () => ServerState,
  removeActions: (roomId: string, maxTimeMs: number) => Promise<void>,
  setState: (roomId: string, state: RoomState) => Promise<boolean>,
  snapshotInterval: number = 1000
) {
  async function saveRoom (roomId: string) {
    if (!roomId) return
    const state = getState()
    const room = state.rooms[roomId]
    if (!room) return
    await setState(roomId, room)
    await removeActions(roomId, room.lastUpdatedAt)
    await new Promise(resolve => setTimeout(resolve, snapshotInterval))         // todo: delay should be customizable
  }

  return noConcurrent(saveRoom)
}
