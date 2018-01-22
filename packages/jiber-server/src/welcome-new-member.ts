import { Action, OPEN, STATE } from 'jiber-core'
import { ServerStore } from './server-store'

/**
 * When a user joins a room, send them the current state of that room
 */
export const welcomeNewMember = (store: ServerStore, action: Action) => {
  if (action.type !== OPEN) return
  if (!action.$doc || !action.$uid) return

  const state = store.getState()
  const roomState = state[action.$doc]
  if (!roomState) return

  const message: Action = {
    type: STATE,
    state: roomState,
    $doc: action.$doc
  }

  store.socketServer.sendToUser(action.$uid, message)
}
