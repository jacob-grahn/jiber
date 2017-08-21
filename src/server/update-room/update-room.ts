import { Action, RoomState } from '../../core/index'
import { noConcurrent } from '../utils/no-concurrent'
import logger from '../utils/logger'

export const createUpdateRoom = (
  ensureRoom: (roomId: string) => Promise<RoomState>,
  fetchActions: (roomId: string, minTimeMs: number) => Promise<Action[]>,
  applyAction: (action: Action) => any,
  saveRoom: (roomId: string) => void
) => {
  return noConcurrent(async (roomId: string) => {
    if (!roomId) return undefined
    try {
      const roomState = await ensureRoom(roomId)
      const actions = await fetchActions(roomId, roomState.lastUpdatedAt)       // get queued actions
      actions.forEach(applyAction)
      process.nextTick(() => saveRoom(roomId))
    } catch (e) {
      logger.error('update-room.ts', e)
    }
  }) as (roomId: string) => Promise<void>
}
