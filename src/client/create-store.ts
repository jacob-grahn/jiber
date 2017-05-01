import sendToServer from './middleware/send-to-server'
import sendToPeers from './middleware/send-to-peers'
import injectMetadata from './middleware/inject-metadata'
import optimistic from './reducers/optimistic'
import simpleSetter from '../core/reducers/simple-setter'
import store from '../core/store'
import { Middleware, Store, Reducer } from '../core'
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
export default function createStore (optionInput: OptionsInput = {}): Store {
  const options = {
    ...defaultOptions,
    ...optionInput
  }
  const optimisticReducer = optimistic(options.reducer)
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer(options),
    sendToPeers(options)
  ]
  return store(options.reducer, clientMiddleware)
}
