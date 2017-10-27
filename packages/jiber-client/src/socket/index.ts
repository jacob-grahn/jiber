import { ClientStore } from '../client-store'
import { ClientSettings } from '../interfaces/client-settings'
import { createTrySocket } from './try-socket'
import { actionHandler } from './action-handler'
import { Action } from 'jiber-core'

/**
 * Some odd manual dependency injection
 */
export const createSocket = (store: ClientStore, settings: ClientSettings) => {
  const socket = createTrySocket(settings)
  const sendAction = (action: Action) => socket.send(JSON.stringify(action))

  socket.onmessage = (event: MessageEvent) => {
    const action = JSON.parse(event.data)
    action.$confirmed = true
    actionHandler(sendAction, store.getState, action)
    store.dispatch(action)
  }

  return {
    sendAction
  }
}
