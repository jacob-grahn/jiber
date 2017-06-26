import { Action, JOIN_ROOM, confirmedState } from '../../core/index'
import ServerStore from '../interfaces/server-store'

export default ((sendToUser: (userId: string, action: Action) => void) => (store: ServerStore) => (next: Function) => (action: Action) => {
  if (action.type === JOIN_ROOM) {
    const state = store.getState()
    const room = state.rooms[action.$hope.roomId]
    const action = confirmedState(action.$hope.roomId, room.confirmedState)
    sendToUser(action.$hope.userId, action)
  }
}
