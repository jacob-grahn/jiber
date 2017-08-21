import { createSendToServer } from './middleware/send-to-server'
import { injectMetadata } from './middleware/inject-metadata'
import { createStore } from '../core/index'
import ClientSettingsInput from './interfaces/client-settings-input'
import ClientStore from './interfaces/client-store'
import { createSocket } from './socket/index'
import { createCreateRoom } from './create-room'
import defaultOptions from './default-options'
import { createClientReducer } from './client-reducer'

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export const createClientStore = (optionInput: ClientSettingsInput = {}) => {
  const options = {...defaultOptions, ...optionInput}
  const clientReducer = createClientReducer(options.reducer)
  const store = createStore(clientReducer, options.initialState) as ClientStore
  const createRoom = createCreateRoom(store)
  const clientStore: ClientStore = {...store, createRoom}
  const serverOptions = {...options, store: clientStore}
  const hopeSocket = createSocket(clientStore, serverOptions)
  const sendToServer = createSendToServer(hopeSocket.send)
  const clientMiddleware = [
    ...options.middleware,
    sendToServer,
    injectMetadata
  ]
  store.setMiddleware(clientMiddleware)

  return clientStore
}
