import { JOIN_ROOM, Action } from '../../core/index'
import ClientState from '../interfaces/client-state'

export default function rejoinRooms (
  sendAction: (action: Action) => void,
  getState: () => ClientState
): void {
  const state = getState()
  Object.keys(state.rooms).forEach(roomId => {
    const action = {type: JOIN_ROOM, $hope: {roomId}}
    sendAction(action)
  })
}
