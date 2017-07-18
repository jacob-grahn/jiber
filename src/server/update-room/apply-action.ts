import { Action, RoomState, SERVER, diff } from '../../core/index'

export default function (
  dispatch: (action: Action) => void,
  getRoomState: (roomId: string) => RoomState,
  sendToRoom: (roomId: string, action: Action) => void
) {
  return function applyAction (action: Action): void {
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
    dispatch(action)
    delete action.$hope.source
    sendToRoom(action.$hope.roomId, action)
  }

  function privateApply (action: Action): void {
    const roomId = action.$hope.roomId

    const state = getRoomState(roomId)
    state.confirmedState.$serverOnly = state.serverOnly
    state.confirmedState.$members = state.members

    dispatch(action)

    const newState = getRoomState(roomId)
    newState.serverOnly = newState.confirmedState.$serverOnly
    newState.members = newState.confirmedState.$members
    delete newState.confirmedState.$serverOnly
    delete newState.confirmedState.$members

    const deltas = diff(state.confirmedState, newState.confirmedState)
    const patchAction = {type: 'hope/PATCH', deltas, $hope: {roomId}}
    sendToRoom(roomId, patchAction)
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
