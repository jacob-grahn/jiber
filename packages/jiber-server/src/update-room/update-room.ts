import { Action, RoomState } from 'jiber-core'

export const createUpdateRoom = (
  ensureRoom: (roomId: string) => Promise<RoomState>,
  applyAction: (action: Action) => any,
  saveRoom: (roomId: string) => void
) => {
  return async (action: Action) => {
    const roomId = action.$r
    if (!roomId) return
    await ensureRoom(roomId)
    applyAction(action)
    process.nextTick(() => saveRoom(roomId))
  }
}
