import createSendToServer from './middleware/send-to-server'
import createSendToPeers from './middleware/send-to-peers'
import createInjectMetadata from './middleware/inject-metadata'
import { getState, setState } from './hope-state'
import clientRoom from './reducers/client-room/client-room'
import spy from './reducers/spy/spy'
import {
  Store,
  createStore,
  simpleSetter,
  roomsById
} from '../core/index'
import Options from './interfaces/options'
import OptionsInput from './interfaces/options-input'
import createServerConnection from './server-connection'

const defaultOptions: Options = {
  reducer: simpleSetter,
  middleware: [],
  roomId: 'default',
  serverUrl: '',
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

  const serverConnection = createServerConnection(options)

  const sendToServer = createSendToServer(serverConnection, getState)
  const sendToPeers = createSendToPeers()
  const injectMetadata = createInjectMetadata(getState)
  const clientMiddleware = [
    ...options.middleware,
    injectMetadata,
    sendToServer,
    sendToPeers
  ]

  const roomsReducer = roomsById(clientRoom(options.reducer))
  const topReducer = spy(roomsReducer, setState)
  return createStore(topReducer, clientMiddleware)
}
