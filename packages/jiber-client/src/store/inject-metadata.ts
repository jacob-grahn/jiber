import { Action, Store, SELF, SERVER, PEER } from 'jiber-core'

/**
 * add handy metadata like $timeMs and $src to incoming actions
 * @hidden
 */
export const injectMetadata = (store: Store, action: Action) => {
  const state = store.getState()

  if (action.$src !== SERVER && action.$src !== PEER) {
    action.$src = SELF
    action.$madeAt = new Date().getTime()
    action.$user = state.me
  }

  return action
}
