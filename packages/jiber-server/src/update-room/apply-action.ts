import { Action } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'

export const createApplyAction = (
  dispatch: (action: Action) => void,
  getState: () => ServerState,
  sendToRoom: (roomId: string, action: Action) => void
) => {
  return (action: Action): void => {
    if (!action.$r || !action.$u) return

    const state = getState()
    const userId = action.$u
    const room = state.rooms[action.$r]
    const user = room.members[userId] || state.users[userId] || {}
    const lastActionId = user.actionId || 0
    const nextActionId = action.$id || 1

    if (nextActionId <= lastActionId) return

    sendToRoom(action.$r, action)

    action.$confirmed = true
    action.$user = user
    dispatch(action)
  }
}
