import {
  Action,
  RoomState,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  PATCH,
  SERVER,
  diff
} from '../../core/index'

const addMetadata = (roomState: RoomState, action: Action): Action => {
  action.$source = SERVER
  if (!action.$userId) return action
  const member = roomState.members[action.$userId] || {}
  const lastActionId = member.actionId || 0
  action.$actionId = lastActionId + 1
  return action
}

export const createApplyAction = (
  dispatch: (action: Action) => void,
  getRoom: (roomId: string) => RoomState,
  sendToRoom: (roomId: string, action: Action) => void
) => {
  const publicApply = (action: Action): void => {
    if (!action.$roomId) return
    dispatch(action)
    sendToRoom(action.$roomId, action)
  }

  const privateApply = (action: Action): void => {
    if (!action.$roomId) return
    const $roomId = action.$roomId
    const $timeMs = action.$timeMs
    const beforeState = getRoom($roomId)

    dispatch({type: INJECT_PRIVATE, $roomId})
    dispatch(action)
    dispatch({type: CLEAN_PRIVATE, $roomId})

    const afterState = getRoom($roomId)
    const confirmedChanges = diff(beforeState.confirmed, afterState.confirmed)
    const memberChanges = diff(beforeState.members, afterState.members)

    const patchAction = {
      type: PATCH,
      confirmed: confirmedChanges,
      members: memberChanges,
      $roomId,
      $timeMs
    }
    sendToRoom($roomId, patchAction)
  }

  return (action: Action): void => {
    if (!action.$roomId) return
    const roomState = getRoom(action.$roomId)
    action = addMetadata(roomState, action)

    if (action.type.indexOf('$serverOnly/') === 0) {
      privateApply(action)
    } else {
      publicApply(action)
    }
  }
}
