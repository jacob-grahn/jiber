import { Action, Store } from '../interfaces'
import { SELF, SERVER, PEER } from '../constants'
import { get } from '../utils/get'

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
    action.$userId = get(state, 'me.userId')
  }

  return action
}
