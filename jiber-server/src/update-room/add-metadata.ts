import { Action, RoomState, SERVER } from '../core'

export const addMetadata = (roomState: RoomState, action: Action): Action => {
  const userId = action.$userId
  if (!userId) return action
  const member = roomState.members[userId] || {}
  const lastActionId = member.actionId || 0
  action.$source = SERVER
  action.$actionId = lastActionId + 1
  action.$user = member
  return action
}
