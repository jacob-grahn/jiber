import { Action, JOIN_ROOM, CONFIRMED_STATE } from 'jiber-core'
import { ServerStore } from './server-store'

/**
 * When a user joins a room, send them the current state of that room
 */
export const welcomeNewMember = (store: ServerStore, action: Action) => {
  if (action.type !== JOIN_ROOM) return
  if (!action.$r || !action.$u) return

  const state = store.getState()
  const room = state.rooms[action.$r]
  if (!room) return

  const message: Action = {
    type: CONFIRMED_STATE,
    confirmed: room.confirmed,
    members: room.members,
    $r: action.$r
  }

  store.socketServer.sendToUser(action.$u, message)
}
