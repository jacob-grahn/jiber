import { Action, JOIN_ROOM } from 'jiber-core'
import { ServerStore } from '../server-store'

export const applyAction = (store: ServerStore, action: Action): void => {
  if (!action.$r || !action.$u) return

  const state = store.getState()
  const userId = action.$u
  const room = state.rooms[action.$r]
  const user = room.members[userId] || state.users[userId] || {}
  const lastActionId = user.actionId || 0
  const nextActionId = action.$id || 1

  if (nextActionId <= lastActionId) return

  // a hack to send user info when joining a room
  if (action.type === JOIN_ROOM) action.$user = user

  store.socketServer.sendToRoom(action.$r, action)

  action.$confirmed = true
  action.$user = user
  store.dispatch(action)
}
