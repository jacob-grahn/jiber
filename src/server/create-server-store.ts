import { ServerOptions } from './interfaces/server-options'
import { ServerSettings } from './interfaces/server-settings'
import {
  createStore,
  createDictionary,
  simpleSetter,
  combineReducers,
  Store
} from '../core/index'
import memStorage from './storage/mem-storage'
import memAccounts from './accounts/mem-accounts'
import createSocketServer from './socket-server/create-socket-server'
import serverRoom from './reducers/server-room/server-room'
import sockets from './reducers/sockets'
import users from './reducers/users'

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
  inputSettings: ServerOptions = {}
): Store {
  const settings: ServerSettings = {...defaultSettings, ...inputSettings}

  const reducer = combineReducers({
    sockets,
    users,
    rooms: createDictionary(serverRoom(settings.reducer), '$hope')
  })

  const store = createStore(reducer, inputSettings.initialState)
  const socketServer = createSocketServer(store, settings)
  socketServer.start()

  return store
}
