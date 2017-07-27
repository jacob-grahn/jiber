import { JOIN_ROOM, Action } from '../../core/index'
import ClientState from '../interfaces/client-state'

export default function rejoinRooms (
  sendAction: (socket: WebSocket, action: Action) => void,
  getState: () => ClientState
) {
  return function (socket: WebSocket) {
    const state = getState()
    Object.keys(state.rooms).forEach(roomId => {
      const action = {type: JOIN_ROOM, $hope: {roomId}}
      sendAction(socket, action)
    })
  }
}
