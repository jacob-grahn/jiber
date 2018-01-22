import { Action, OPEN, STATE } from 'jiber-core'
import { ServerStore } from './server-store'

/**
 * When a user joins a , send them the current state of that
 */
export const welcomeNewMember = (store: ServerStore, action: Action) => {
  if (action.type !== OPEN) return
  if (!action.$doc || !action.$uid) return

  const state = store.getState()
  const docState = state[action.$doc]
  if (!docState) return

  const message: Action = {
    type: STATE,
    state: docState,
    $doc: action.$doc
  }

  store.socketServer.sendToUser(action.$uid, message)
}
