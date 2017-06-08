import createSendToServer from './middleware/send-to-server'
import injectMetadata from './middleware/inject-metadata'
import clientRoom from './reducers/client-room/client-room'
import myUserId from './reducers/hope-client/my-user-id'
import {
  Store,
  Action,
  createStore,
  simpleSetter,
  roomsById,
  combineReducers
} from '../core/index'
import Options from './interfaces/options'
import OptionsInput from './interfaces/options-input'
import createServerConnection from './server-connection'

const defaultOptions: Options = {
  reducer: simpleSetter,
  middleware: [],
  url: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80,
  credential: ''
}

// When creating a client store, add middleware to send actions to the server
// and peers
export default function clientStore (optionInput: OptionsInput = {}): Store {
  const options = {
    ...defaultOptions,
    ...optionInput
  }

  let store: Store                                                              // serverConnection needs store.dispatch, but the store

  const serverConnection = createServerConnection({
    ...options,
    dispatch: (action: Action) => store.dispatch(action)
  })
  const sendToServer = createSendToServer(serverConnection)
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer
  ]

  const rooms = roomsById(clientRoom(options.reducer))
  const topReducer = combineReducers({rooms, myUserId})
  store = createStore(topReducer, clientMiddleware)
  return store
}
