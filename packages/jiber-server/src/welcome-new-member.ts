import { Action, JOIN_ROOM, STATE } from 'jiber-core'
import { ServerStore } from './server-store'

/**
 * When a user joins a room, send them the current state of that room
 */
export const welcomeNewMember = (store: ServerStore, action: Action) => {
  if (action.type !== JOIN_ROOM) return
  if (!action.$roomId || !action.$userId) return

  const state = store.getState()
  const roomState = state.rooms[action.$roomId]
  if (!roomState) return

  const message: Action = {
    type: STATE,
    state: roomState,
    $roomId: action.$roomId
  }

  store.socketServer.sendToUser(action.$userId, message)
}
