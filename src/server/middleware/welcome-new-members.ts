import { Action, JOIN_ROOM, CONFIRMED_STATE } from '../../core/index'
import ServerStore from '../interfaces/server-store'
import filterPrivate from '../utils/filter-private'

export default function welcomeNewMembers (
  sendToUser: (userId: string, action: Action) => void
) {
  return (store: ServerStore) => (next: Function) => (action: Action) => {
    next(action)
    if (action.type !== JOIN_ROOM) return
    if (!action.$hope || !action.$hope.userId || !action.$hope.roomId) return

    const state = store.getState()
    const roomId = action.$hope.roomId
    const room = state.rooms[roomId]
    if (!room) return
    const message: Action = {
      type: CONFIRMED_STATE,
      confirmed: filterPrivate(room.confirmed),
      members: room.members,
      $hope: {
        roomId,
        timeMs: new Date().getTime()
      }
    }
    sendToUser(action.$hope.userId, message)
  }
}
