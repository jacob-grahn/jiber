import createSendToServer from './middleware/send-to-server'
import injectMetadata from './middleware/inject-metadata'
import clientRoom from './reducers/client-room/client-room'
import me from './reducers/me'
import {
  Action,
  Store,
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

  let store: Store                                                              // serverConnection needs store.dispatch, but the store

  const serverConnection = createServerConnection({
    ...options,
    store: {
      dispatch: (action: Action) => store.dispatch(action),
      getState: () => store.getState(),
      createRoom: () => { /* do nothing */ }
    }
  })
  const sendToServer = createSendToServer(serverConnection)
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer
  ]

  const rooms = dictionary(clientRoom(options.reducer), '$hope.roomId')
  const topReducer = combineReducers({rooms, users, me})
  store = createStore(topReducer, undefined, clientMiddleware)

  return {
    ...store,
    createRoom: createRoom(store)
  }
}
