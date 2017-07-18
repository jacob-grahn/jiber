// dependency injection for updateRoom

import ServerStore from '../interfaces/server-store'
import ServerSettings from '../interfaces/server-settings'
import SocketServer from '../interfaces/socket-server'
import createApplyAction from './apply-action'
import createEnsureRoom from './ensure-room'
import createGetRoom from './get-room'
import createSaveRoom from './save-room'
import createUpdateRoom from './update-room'

export default function (
  store: ServerStore,
  settings: ServerSettings,
  socketServer: SocketServer
) {
  const dispatch = store.dispatch
  const getState = store.getState
  const fetchState = settings.storage.fetchState
  const fetchActions = settings.storage.fetchActions
  const sendToRoom = socketServer.sendToRoom

  const getRoom = createGetRoom(getState)
  const ensureRoom = createEnsureRoom(dispatch, getRoom, fetchState)
  const applyAction = createApplyAction(dispatch, getRoom, sendToRoom)
  const saveRoom = createSaveRoom(getRoom, settings)
  const updateRoom = createUpdateRoom(
    ensureRoom,
    fetchActions,
    applyAction,
    saveRoom
  )

  return updateRoom
}
