import {
  Action,
  RoomState,
  SERVER,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  PATCH,
  diff
} from '../../core/index'

export default function (
  dispatch: (action: Action) => void,
  getRoomState: (roomId: string) => RoomState,
  sendToRoom: (roomId: string, action: Action) => void
) {
  return function applyAction (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    const roomState = getRoomState(roomId)
    action = addMetadata(roomState, action)

    if (action.type.indexOf('$serverOnly/') === 0) {
      privateApply(action)
    } else {
      quickApply(action)
    }
  }

  function quickApply (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    dispatch(action)
    delete action.$hope.source
    sendToRoom(action.$hope.roomId, action)
  }

  function privateApply (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    const beforeState = getRoomState(roomId)

    dispatch({type: INJECT_PRIVATE, $hope: action.$hope})
    dispatch(action)
    dispatch({type: CLEAN_PRIVATE, $hope: action.$hope})

    const afterState = getRoomState(roomId)
    const stateChanges = diff(beforeState.confirmed, afterState.confirmed)
    const userChanges = diff(beforeState.members, afterState.members)

    const patchAction = {
      type: PATCH,
      stateChanges,
      userChanges,
      $hope: {roomId}
    }
    sendToRoom(roomId, patchAction)
  }
}

function addMetadata (roomState: RoomState, action: Action): Action {
  if (!action.$hope || !action.$hope.userId) return action
  const userId = action.$hope.userId
  const member = roomState.members[userId] || {}
  const lastActionId = member.actionId || 0
  action.$hope.source = SERVER
  action.$hope.actionId = lastActionId + 1
  return action
}
