import { Action, Store, createStore, SERVER } from 'jiber-core'
import { createSendToServer } from './middleware/send-to-server'
import { addActionId } from './middleware/add-action-id'
import { injectMetadata } from './middleware/inject-metadata'
import { ClientSettingsInput } from './interfaces/client-settings-input'
import { ClientState } from './interfaces/client-state'
import { ToughSocket } from './tough-socket'
import { Room } from './room'
import { defaultClientSettings } from './default-client-settings'
import { createClientReducer } from './client-reducer'
import { PeerManager } from './webrtc'
import { actionHandler } from './action-handler'

export interface ClientStore extends Store {
  getState: () => ClientState,
  createRoom: (roomId: string) => any
}

/**
 * When creating a client store, add middleware to send actions to the server
 * and peers
 */
export const createClientStore = (optionInput: ClientSettingsInput = {}) => {
  const options = { ...defaultClientSettings, ...optionInput }
  const clientReducer = createClientReducer(options.reducer)
  const toughSocket = new ToughSocket(options)
  const sendAction = (action: Action) => toughSocket.send(JSON.stringify(action))
  const sendToServer = createSendToServer(sendAction)
  const middleware = [
    ...options.middleware,
    addActionId,
    sendToServer,
    injectMetadata
  ]
  const store = createStore(clientReducer, options.initialState, middleware)
  const createRoom = (roomId: string) => {
    return new Room(store, roomId, options.actionCreators)
  }
  const clientStore: ClientStore = { ...store, createRoom }

  toughSocket.onmessage = (event: MessageEvent) => {
    const action = JSON.parse(event.data)
    action.$confirmed = true
    action.$source = SERVER
    actionHandler(sendAction, store.getState, action)
    store.dispatch(action)
  }

  new PeerManager(store, options) // tslint:disable-line

  return clientStore
}
