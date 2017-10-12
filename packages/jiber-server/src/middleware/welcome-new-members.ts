import * as EventEmitter from 'events'
import {
  Action,
  UserDict,
  Next,
  Store,
  JOIN_ROOM,
  CONFIRMED_STATE,
  SEND_TO_USER
} from 'jiber-core'

/**
 * Only expose specific fields of user accounts
 */
const giveMembersSomePrivacy = (members: UserDict) => {
  const userIds = Object.keys(members)
  const publicMembers = userIds.reduce((collector, userId) => {
    const user = members[userId]
    if (user) {
      collector[userId] = {
        userId: user.userId,
        public: user.public,
        actionId: user.actionId,
        grantRead: user.grantRead,
        grantWrite: user.grantWrite
      }
    }
    return collector
  }, {} as UserDict)
  return publicMembers
}

/**
 * When a user joins a room, send them the current state of that room
 */
export const createWelcomeNewMembers = (emitter: EventEmitter) => {
  return (store: Store) => (next: Next) => (action: Action) => {
    next(action)

    if (action.type !== JOIN_ROOM) return
    if (!action.$r || !action.$u) return

    const state = store.getState()
    const room = state.rooms[action.$r]
    if (!room) return

    const message: Action = {
      type: CONFIRMED_STATE,
      confirmed: room.confirmed,
      members: giveMembersSomePrivacy(room.members),
      $r: action.$r
    }

    emitter.emit(SEND_TO_USER, action.$u, message)
  }
}
