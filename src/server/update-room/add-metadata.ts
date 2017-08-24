import { Action, RoomState, SERVER } from '../../core/index'

export const addMetadata = (roomState: RoomState, action: Action): Action => {
  action.$source = SERVER
  if (!action.$userId) return action
  const member = roomState.members[action.$userId] || {}
  const lastActionId = member.actionId || 0
  action.$actionId = lastActionId + 1
  return action
}
