import { HopeAction, JOIN_ROOM, CONFIRMED_STATE, SERVER } from '../../core/index'
import ServerStore from '../interfaces/server-store'
import filterPrivate from '../utils/filter-private'

export interface SendToUser {
  (userId: string, action: HopeAction): void
}

export default (sendToUser: SendToUser) => {
  return (store: ServerStore) => (next: Function) => (action: HopeAction) => {
    next(action)
    if (action.type === JOIN_ROOM) {
      const state = store.getState()
      const roomId = action.$hope.roomId
      const room = state.rooms[roomId]
      if (!room) return
      const message: HopeAction = {
        type: CONFIRMED_STATE,
        confirmed: filterPrivate(room.confirmed),
        members: room.members,
        $hope: {
          roomId,
          userId: '',
          actionId: 0,
          source: SERVER,
          timeMs: new Date().getTime()
        }
      }
      sendToUser(action.$hope.userId, message)
    }
  }
}
