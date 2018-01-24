import { Store, createStore, combineReducers, DB } from 'jiber-core'
import { ServerSettingsInput, ServerSettings, ServerState } from './interfaces'
import { watchers } from './reducers/watchers'
import { createSocketServer, SocketServer } from './socket-server/index'
import { defaultServerSettings } from './default-server-settings'
import { onAction } from './on-action'

export interface ServerStore extends Store {
  getState: () => ServerState,
  socketServer: SocketServer,
  db: DB,
  settings: ServerSettings,
  start: () => void,
  stop: () => void
}

export const createServerStore = (
  inputSettings: ServerSettingsInput = {}
): ServerStore => {
  const initialState = inputSettings.initialState
  const settings = { ...defaultServerSettings, ...inputSettings }
  const reducer = combineReducers({ state: settings.reducer, watchers })
  const store = createStore(reducer, initialState)
  const serverStore = { ...store, db: settings.db, settings } as ServerStore

  const socketServer = createSocketServer(serverStore)
  serverStore.socketServer = socketServer
  serverStore.start = socketServer.start
  serverStore.stop = socketServer.stop

  settings.db.onaction = (action) => onAction(serverStore, action)

  return serverStore
}
