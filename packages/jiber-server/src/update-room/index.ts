import { Action } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'
import { ServerSettings } from '../interfaces/server-settings'
import { SocketServer } from '../socket-server/index'
import { createApplyAction } from './apply-action'
import { createEnsureRoom } from './ensure-room'
import { createGetRoom } from './get-room'
import { createSaveRoom } from './save-room'
import { createUpdateRoom as _createUpdateRoom } from './update-room'

/**
 * dependency injection for updateRoom
 */
export const createUpdateRoom = (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  settings: ServerSettings,
  socketServer: SocketServer
) => {
  const dispatch = store.dispatch
  const getState = store.getState
  const fetchState = settings.db.fetchState
  const stashState = settings.db.stashState
  const snapshotInterval = settings.snapshotInterval
  const sendToRoom = socketServer.sendToRoom

  const getRoom = createGetRoom(getState)
  const ensureRoom = createEnsureRoom(dispatch, getRoom, fetchState)
  const applyAction = createApplyAction(dispatch, getState, sendToRoom)
  const saveRoom = createSaveRoom(snapshotInterval, getRoom, stashState)
  const updateRoom = _createUpdateRoom(ensureRoom, applyAction, saveRoom)

  return updateRoom
}
