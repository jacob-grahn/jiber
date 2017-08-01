import { Action, JOIN_ROOM, CONFIRMED_STATE } from '../../core/index'
import ServerStore from '../interfaces/server-store'

export default function welcomeNewMembers (
  sendToUser: (userId: string, action: Action) => void
) {
  return (store: ServerStore) => (next: Function) => (action: Action) => {
    next(action)

    if (action.type !== JOIN_ROOM) return
    if (!action.$roomId || !action.$userId) return

    const state = store.getState()
    const room = state.rooms[action.$roomId]
    if (!room) return

    const message: Action = {
      type: CONFIRMED_STATE,
      confirmed: room.confirmed,
      members: room.members,
      $roomId: action.$roomId,
      $timeMs: new Date().getTime()
    }
    sendToUser(action.$userId, message)
  }
}
