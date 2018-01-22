import { Action, Store, SELF, SERVER, PEER } from 'jiber-core'

/**
 * add handy metadata like $timeMs and $source to incoming actions
 * @hidden
 */
export const injectMetadata = (store: Store, action: Action) => {
  const state = store.getState()

  if (action.$source === SERVER || action.$source === PEER) {
    if (action.$uid && action.$doc) {
      const  = state.s[action.$doc]
      if () {
        action.$user = .members[action.$uid]
      }
    }
  } else {
    action.$source = SELF
    action.$time = new Date().getTime()
    action.$uid = state.me.uid
  }

  return action
}
