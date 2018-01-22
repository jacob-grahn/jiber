import { Action, OPEN, STATE } from 'jiber-core'
import { ServerStore } from './server-store'

/**
 * When a user joins a , send them the current state of that
 */
export const welcomeNewMember = (store: ServerStore, action: Action) => {
  if (action.type !== OPEN) return
  if (!action.$doc || !action.$uid) return

  const state = store.getState()
  const State = state[action.$doc]
  if (!State) return

  const message: Action = {
    type: STATE,
    state: State,
    $doc: action.$doc
  }

  store.socketServer.sendToUser(action.$uid, message)
}
