import {
  Action,
  RoomState,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  CONFIRM_ACTION,
  PATCH,
  diff
} from '../../core/index'

export default function (
  dispatch: (action: Action) => void,
  getRoom: (roomId: string) => RoomState,
  sendToRoom: (roomId: string, action: Action) => void
) {
  return function applyAction (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    const roomState = getRoom(roomId)
    action = addMetadata(roomState, action)

    if (action.type.indexOf('$serverOnly/') === 0) {
      privateApply(action)
    } else {
      quickApply(action)
    }
  }

  function quickApply (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    dispatch({type: CONFIRM_ACTION, action, $hope: action.$hope})
    sendToRoom(roomId, action)
  }

  function privateApply (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    const beforeState = getRoom(roomId)

    dispatch({type: INJECT_PRIVATE, $hope: {roomId}})
    dispatch({type: CONFIRM_ACTION, action, $hope: action.$hope})
    dispatch({type: CLEAN_PRIVATE, $hope: {roomId}})

    const afterState = getRoom(roomId)
    const confirmedChanges = diff(beforeState.confirmed, afterState.confirmed)
    const memberChanges = diff(beforeState.members, afterState.members)

    const patchAction = {
      type: PATCH,
      confirmed: confirmedChanges,
      members: memberChanges,
      $hope: {roomId},
      lastUpdatedAt: afterState.lastUpdatedAt
    }
    sendToRoom(roomId, patchAction)
  }
}

function addMetadata (roomState: RoomState, action: Action): Action {
  if (!action.$hope || !action.$hope.userId) return action
  const userId = action.$hope.userId
  const member = roomState.members[userId] || {}
  const lastActionId = member.actionId || 0
  action.$hope.actionId = lastActionId + 1
  return action
}
