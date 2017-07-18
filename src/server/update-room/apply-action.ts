import { Action, RoomState, SERVER } from '../../core/index'

export default function (
  dispatch: (action: Action) => void,
  getRoomState: (roomId: string) => RoomState,
  sendToRoom: (roomId: string, action: Action) => void
) {
  return function applyAction (action: Action): void {
    const roomId = action.$hope.roomId
    const roomState = getRoomState(roomId)
    const actionWithMeta = addMetadata(roomState, action)
    dispatch(actionWithMeta)
    delete action.$hope.source
    sendToRoom(roomId, action)
  }
}

function addMetadata (roomState: RoomState, action: Action): Action {
  const userId = action.$hope.userId
  const member = roomState.members[userId] || {}
  const lastActionId = member.actionId || 0
  action.$hope.source = SERVER
  action.$hope.actionId = lastActionId + 1
  return action
}
