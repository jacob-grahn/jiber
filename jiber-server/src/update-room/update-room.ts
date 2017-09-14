import { Action, RoomState } from 'jiber-core'
import { noConcurrent } from '../utils/no-concurrent'
import { logger } from '../utils/logger'

export const createUpdateRoom = (
  _ensureRoom: (roomId: string) => Promise<RoomState>,
  _applyAction: (action: Action) => any,
  saveRoom: (roomId: string) => void
) => {
  return noConcurrent(async (roomId: string) => {
    if (!roomId) return undefined
    try {
      // const roomState = await ensureRoom(roomId)
      // const actions = await fetchActions(roomId, roomState.lastUpdatedAt)       // get queued actions
      // actions.forEach(applyAction)
      process.nextTick(() => saveRoom(roomId))
    } catch (e) {
      logger.error('update-room.ts', e)
    }
  }) as (roomId: string) => Promise<void>
}
