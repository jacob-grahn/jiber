import { Action, Store, createStore } from 'jiber-core'
import { createSendToServer } from './middleware/send-to-server'
import { addActionId } from './middleware/add-action-id'
import { injectMetadata } from './middleware/inject-metadata'
import { ClientSettingsInput } from './interfaces/client-settings-input'
import { ClientState } from './interfaces/client-state'
import { createSocket } from './socket/index'
import { createCreateRoom } from './room'
import { defaultClientSettings } from './default-client-settings'
import { createClientReducer } from './client-reducer'

export interface ClientStore extends Store {
  getState: () => ClientState,
  createRoom: (roomId: string) => any
}

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export const createClientStore = (optionInput: ClientSettingsInput = {}) => {
  const options = {...defaultClientSettings, ...optionInput}
  const clientReducer = createClientReducer(options.reducer)
  const send = (action: Action) => socket.sendAction(action) // tslint:disable-line
  const sendToServer = createSendToServer(send)
  const middleware = [
    ...options.middleware,
    addActionId,
    sendToServer,
    injectMetadata
  ]
  const store = createStore(clientReducer, options.initialState, middleware)
  const createRoom = createCreateRoom(store, options.actionCreators)
  const clientStore: ClientStore = {...store, createRoom}
  const serverOptions = {...options, store: clientStore}
  const socket = createSocket(clientStore, serverOptions)

  return clientStore
}
