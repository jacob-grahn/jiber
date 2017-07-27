import createSendToServer from './middleware/send-to-server'
import injectMetadata from './middleware/inject-metadata'
import { createStore } from '../core/index'
import ClientSettingsInput from './interfaces/client-settings-input'
import ClientStore from './interfaces/client-store'
import createHopeSocket from './socket/index'
import createRoom from './create-room'
import defaultOptions from './default-options'
import createClientReducer from './client-reducer'

// When creating a client store, add middleware to send actions to the server
// and peers
export default function createClientStore (
  optionInput: ClientSettingsInput = {}
): ClientStore {
  const options = {...defaultOptions, ...optionInput}
  const clientReducer = createClientReducer(options.reducer)
  const store = createStore(clientReducer, options.initialState)
  const clientStore: ClientStore = {...store, createRoom: createRoom(store)}
  const serverOptions = {...options, store: clientStore}
  const hopeSocket = createHopeSocket(clientStore, serverOptions)
  const sendToServer = createSendToServer(hopeSocket.send)
  const clientMiddleware = [
    ...options.middleware,
    sendToServer,
    injectMetadata
  ]
  store.setMiddleware(clientMiddleware)

  return clientStore
}
