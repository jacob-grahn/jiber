import { Action, Store, SELF, SERVER, PEER } from 'jiber-core'

/**
 * add handy metadata like $timeMs and $source to incoming actions
 * @hidden
 */
export const injectMetadata = (store: Store, action: Action) => {
  const state = store.getState()

  if (action.$source === SERVER || action.$source === PEER) {
    if (action.$userId && action.$roomId) {
      const room = state.rooms[action.$roomId]
      if (room) {
        action.$user = room.members[action.$userId]
      }
    }
  } else {
    action.$source = SELF
    action.$time = new Date().getTime()
    action.$uid = state.me.userId
  }

  return action
}
