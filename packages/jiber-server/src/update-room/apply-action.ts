import { Action, SERVER } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'

export const createApplyAction = (
  dispatch: (action: Action) => void,
  getState: () => ServerState,
  sendToRoom: (roomId: string, action: Action) => void
) => {
  return (action: Action): void => {
    if (!action.$roomId || !action.$userId) return

    const state = getState()
    const userId = action.$userId
    const room = state.rooms[action.$roomId]
    const user = room.members[userId] || state.users[userId] || {}
    const lastActionId = user.actionId || 0
    const nextActionId = action.$actionId || 1

    if (nextActionId <= lastActionId) return

    sendToRoom(action.$roomId, action)

    action.$source = SERVER
    action.$user = user
    dispatch(action)
  }
}
