import { Action, Store, createStore } from 'jiber-core'
import { injectMetadata } from './inject-metadata'
import { ClientSettingsInput } from '../interfaces/client-settings-input'
import { ClientState } from '../interfaces/client-state'
import { Doc } from './doc'
import { defaultClientSettings } from '../default-client-settings'
import { createClientReducer } from './client-reducer'
import { PeerManager } from '../webrtc'
import { serverConnection } from './server-connection'

export interface ClientStore extends Store {
  getState: () => ClientState,
  open: (id: string) => any
}

/**
 * Extend Store to:
 * 1. Send / receive actions from the server
 * 2. Send /receive actions from peers
 * 3. Add a createDoc method
 */
export const createClientStore = (input: ClientSettingsInput = {}) => {
  const settings = { ...defaultClientSettings, ...input }
  const reducer = createClientReducer(settings.reducer)
  const store = createStore(reducer, settings.initialState, settings.middleware)
  const coreDispatch = store.dispatch

  const clientStore: ClientStore = {
    ...store,
    dispatch: (action: Action) => {
      action = injectMetadata(store, action)
      coreDispatch(action)
    },
    open: (id: string) => {
      return new Doc(clientStore, id, settings.actionCreators)
    }
  }

  // send and receive actions from peers
  new PeerManager(clientStore, settings) // tslint:disable-line

  // send and receive actions from server
  serverConnection(clientStore, settings)

  return clientStore
}
