import { Action } from 'jiber-core'
import { applyAction } from './apply-action'
import { ensureRoom } from './ensure-room'
import { createSaveRoom } from './save-room'
import { createUpdateRoom as _createUpdateRoom } from './update-room'
import { ServerStore } from '../server-store'

/**
 *
 */
export const updateRoom = async (store: ServerStore, roomId: string, action: Action) => {
  await ensureRoom(store, roomId)
  applyAction(store, action)
}

) => {
  const dispatch = store.dispatch
  const getState = store.getState
  const fetchState = settings.db.fetchState
  const stashState = settings.db.stashState
  const snapshotInterval = settings.snapshotInterval
  const sendToRoom = socketServer.sendToRoom

  const ensureRoom = createEnsureRoom(dispatch, getRoom, fetchState)
  const applyAction = createApplyAction(dispatch, getState, sendToRoom)
  const saveRoom = createSaveRoom(snapshotInterval, getRoom, stashState)
  const updateRoom = _createUpdateRoom(ensureRoom, applyAction, saveRoom)

  return updateRoom
}
