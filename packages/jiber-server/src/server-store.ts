// todo: DB should not come from jiber-core, it is only used in the server

import { Store, createStore, ACTION_PUSHED, DB } from 'jiber-core'
import { ServerSettingsInput } from './interfaces/server-settings-input'
import { ServerSettings } from './interfaces/server-settings'
import { ServerState } from './interfaces/server-state'
import { createSocketServer, SocketServer } from './socket-server/index'
import { createServerReducer } from './reducers/server-reducer'
import { createUpdateRoom } from './update-room/index'
import { defaultServerSettings } from './default-server-settings'
import { onAction } from './on-action'

export interface ServerStore extends Store {
  getState: () => ServerState,
  socketServer: SocketServer,
  db: DB,
  settings: ServerSettings
}

export const createServerStore = (
  inputSettings: ServerSettingsInput = {}
): ServerStore => {
  const initialState = inputSettings.initialState
  const settings = { ...defaultServerSettings, ...inputSettings }
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, initialState)
  const tempServerStore = { ...store, db: settings.db, settings }

  const socketServer = createSocketServer(tempServerStore)
  const serverStore: ServerStore = { ...tempServerStore, socketServer }

  const updateRoom = createUpdateRoom(store, settings, socketServer)

  settings.db.emitter.on(
    ACTION_PUSHED,
    (action) => onAction(serverStore, updateRoom, action)
  )

  return serverStore
}
