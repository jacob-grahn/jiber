import createSendToServer from './middleware/send-to-server'
import injectMetadata from './middleware/inject-metadata'
import clientRoom from './reducers/client-room/client-room'
import me from './reducers/me'
import {
  createStore,
  simpleSetter,
  dictionary,
  combineReducers,
  users
} from '../core/index'
import ClientSettings from './interfaces/client-settings'
import ClientSettingsInput from './interfaces/client-settings-input'
import ClientStore from './interfaces/client-store'
import createServerConnection from './server-connection'
import createRoom from './create-room'

const defaultOptions: ClientSettings = {
  reducer: simpleSetter,
  middleware: [],
  url: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80,
  credential: ''
}

// When creating a client store, add middleware to send actions to the server
// and peers
export default function createClientStore (
  optionInput: ClientSettingsInput = {}
): ClientStore {
  const options = {
    ...defaultOptions,
    ...optionInput
  }

  const rooms = dictionary(clientRoom(options.reducer), '$hope.roomId')
  const topReducer = combineReducers({rooms, users, me})
  const store = createStore(topReducer, undefined)
  const clientStore: ClientStore = {...store, createRoom: createRoom(store)}

  const serverConnection = createServerConnection({
    ...options,
    store: clientStore
  })
  const sendToServer = createSendToServer(serverConnection)
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer
  ]
  store.setMiddleware(clientMiddleware)

  return clientStore
}
