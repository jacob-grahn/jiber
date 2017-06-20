import ServerSettingsInput from './interfaces/server-settings-input'
import ServerSettings from './interfaces/server-settings'
import { ServerStore } from './interfaces/server-store'
import {
  createStore,
  dictionary,
  simpleSetter,
  combineReducers,
  users
} from '../core/index'
import memStorage from './storage/mem-storage'
import memAccounts from './accounts/mem-accounts'
import createSocketServer from './socket-server/socket-server'
import serverRoom from './reducers/server-room/server-room'
import sockets from './reducers/socket/sockets'

const defaultSettings: ServerSettings = {
  socketPort: 80,
  stunPort: 3478,
  reducer: simpleSetter,
  onLogin: memAccounts,
  storage: memStorage,
  rateLimitPeriodMs: 10000,
  rateLimit: 100,
  maxMessageCharLength: 1000
}

export default function createServerStore (
  inputSettings: ServerSettingsInput = {}
): ServerStore {
  const settings: ServerSettings = {...defaultSettings, ...inputSettings}

  const reducer = combineReducers({
    sockets,
    users,
    rooms: dictionary(serverRoom(settings.reducer), '$hope')
  })

  const store = createStore(reducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  socketServer.start()

  return store
}
