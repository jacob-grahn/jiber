import { Action, Store, createStore } from 'jiber-core'
import { injectMetadata } from './inject-metadata'
import { ClientSettingsInput } from '../interfaces/client-settings-input'
import { ClientState } from '../interfaces/client-state'
import { Room } from './room'
import { defaultClientSettings } from '../default-client-settings'
import { createClientReducer } from '../client-reducer'
import { PeerManager } from '../webrtc'
import { serverConnection } from './server-connection'

export interface ClientStore extends Store {
  getState: () => ClientState,
  createRoom: (roomId: string) => any
}

/**
 * Extend Store to:
 * 1. Send / receive actions from the server
 * 2. Send /receive actions from peers
 * 3. Add a createRoom method
 */
export const createClientStore = (optionInput: ClientSettingsInput = {}) => {
  const options = { ...defaultClientSettings, ...optionInput }
  const clientReducer = createClientReducer(options.reducer)

  const store = createStore(clientReducer, options.initialState, options.middleware)
  const coreDispatch = store.dispatch

  const clientStore: ClientStore = {
    ...store,
    dispatch: (action: Action) => {
      action = injectMetadata(store, action)
      coreDispatch(action)
    },
    createRoom: (roomId: string) => {
      return new Room(clientStore, roomId, options.actionCreators)
    }
  }

  // send and receive actions from peers
  new PeerManager(clientStore, options) // tslint:disable-line

  // send and receive actions from server
  serverConnection(clientStore, options)

  return clientStore
}
