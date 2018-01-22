import { Action, Store, SELF, SERVER, PEER, get } from 'jiber-core'

/**
 * add handy metadata like $timeMs and $src to incoming actions
 * @hidden
 */
export const injectMetadata = (store: Store, action: Action) => {
  if (action.$src !== SERVER && action.$src !== PEER) {
    const state = store.getState()
    action.$src = SELF
    action.$madeAt = new Date().getTime()
    action.$user = state.me
    action.$uid = get(state, 'me.uid')
  }

  return action
}
