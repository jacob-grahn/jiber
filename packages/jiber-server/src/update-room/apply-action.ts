import {
  Action,
  RoomState,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  PATCH,
  diff
} from 'jiber-core'
import { addMetadata } from './add-metadata'
import { ServerState } from '../interfaces/server-state'

export const createApplyAction = (
  dispatch: (action: Action) => void,
  getState: () => ServerState,
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
    const state = getState()
    action = addMetadata(state, action)

    if (action.type.indexOf('$serverOnly/') === 0) {
      privateApply(action)
    } else {
      publicApply(action)
    }
  }
}
