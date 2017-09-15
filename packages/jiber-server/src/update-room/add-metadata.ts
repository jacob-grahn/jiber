import { Action, SERVER } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'

export const addMetadata = (state: ServerState, action: Action): Action => {
  const userId = action.$userId
  if (!userId) return action

  const roomId = action.$roomId
  if (!roomId) return action

  const room = state.rooms[roomId]
  const member = room.members[userId] || state.users[userId] || {}
  const lastActionId = member.actionId || 0
  action.$source = SERVER
  action.$actionId = lastActionId + 1
  action.$user = member
  return action
}
