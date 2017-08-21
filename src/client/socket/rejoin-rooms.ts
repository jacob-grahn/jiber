import { JOIN_ROOM, Action } from '../../core/index'
import { ClientState } from '../interfaces/client-state'

export const createRejoinRooms = (
  sendAction: (socket: WebSocket, action: Action) => void,
  getState: () => ClientState
) => {
  return (socket: WebSocket) => {
    const state = getState()
    Object.keys(state.rooms).forEach($roomId => {
      const action = {type: JOIN_ROOM, $roomId}
      sendAction(socket, action)
    })
  }
}
