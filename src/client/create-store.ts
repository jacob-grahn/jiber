import sendToServer from './middleware/send-to-server'
import sendToPeers from './middleware/send-to-peers'
import rooms from './reducers/rooms'
import {
  Middleware,
  Store,
  Reducer,
  createStore,
  simpleSetter
} from '../core/index'
import Options from './interfaces/options'
import OptionsInput from './interfaces/options-input'

const defaultOptions: Options = {
  reducer: simpleSetter,
  middleware: [],
  roomId: 'default',
  serverUrl: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80
}

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
/* export default function clientStore (optionInput: OptionsInput = {}): Store {
  const options = {
    ...defaultOptions,
    ...optionInput
  }
  const optimisticReducer = rooms(optimisticRoom(options.reducer))
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer(options),
    sendToPeers(options)
  ]
  return createStore(options.reducer, clientMiddleware)
} */
