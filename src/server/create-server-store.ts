import { ServerOptions } from './interfaces/server-options'
import { ServerSettings } from './interfaces/server-settings'
import { createStore, simpleSetter, Store } from '../core/index'
import memStorage from './storage/mem-storage'
import memAccounts from './accounts/mem-accounts'
import createSocketServer from './socket-server/create-socket-server'

const defaultSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: simpleSetter,
  onLogIn: memAccounts,
  storage: memStorage,
  rateLimitPeriodMs: 10000,
  rateLimit: 100,
  maxMessageCharLength: 1000
}

export default function createServerStore (
  inputSettings: ServerOptions = {}
): Store {
  const settings: ServerSettings = {...defaultSettings, ...inputSettings}
  const store = createStore(settings.reducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  socketServer.start()

  return store
}
