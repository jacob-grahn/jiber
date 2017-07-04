import ServerSettingsInput from './interfaces/server-settings-input'
import ServerSettings from './interfaces/server-settings'
import { ServerStore } from './interfaces/server-store'
import { createStore, simpleSetter } from '../core/index'
import memStorage from './storage/mem-storage'
import memAccounts from './accounts/mem-accounts'
import createSocketServer from './socket-server/socket-server'
import createServerReducer from './server-reducer'
import welcomeNewMembers from './middleware/welcome-new-members'

const defaultSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: simpleSetter,
  onLogin: memAccounts,
  storage: memStorage
}

export default function createServerStore (
  inputSettings: ServerSettingsInput = {}
): ServerStore {
  const settings: ServerSettings = {...defaultSettings, ...inputSettings}
  const serverReducer = createServerReducer(settings.reducer)
  const store = createStore(serverReducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  const middleware = [welcomeNewMembers(socketServer.sendToUser)]

  store.setMiddleware(middleware)
  socketServer.start()
  return store
}
