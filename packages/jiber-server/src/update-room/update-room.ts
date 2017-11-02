import { Action } from 'jiber-core'
import { applyAction } from './apply-action'
import { ensureRoom } from './ensure-room'
import { saveRoom } from './save-room'
import { ServerStore } from '../server-store'

/**
 * Update a room
 */
export const updateRoom = async (store: ServerStore, action: Action) => {
  const roomId = action.$r
  if (!roomId) return

  await ensureRoom(store, roomId)
  applyAction(store, action)
  await saveRoom(store, roomId)
}
