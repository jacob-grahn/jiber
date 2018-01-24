import { Reducer, Action, STATE, SERVER } from 'jiber-core'

/**
 * Use the current  state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * @hidden
 */
export const createOptimistic = (subReducer: Reducer) => {
  return (
    docState: {pendingActions: Action[], confirmed: any, optimistic: any, watchers: any},
    action: Action
  ) => {
    const state = docState.optimistic

    if (action.type === STATE) {
      const { pendingActions } = docState
      return pendingActions.reduce(subReducer, docState.confirmed)
    }

    const madeAt = action.$madeAt || 0
    const watcher = docState.watchers[action.$uid]
    const basedAt = watcher ? watcher.time : -1

    if (action.$src === SERVER) {
      const { pendingActions, confirmed } = docState

      // copy is not needed if reducer does not mutate state
      // this could possibly be optional via the settings
      // it is just a pain to always write code that does not mutate
      const confirmedCopy = confirmed ? JSON.parse(JSON.stringify(confirmed)) : confirmed
      return pendingActions.reduce(subReducer, confirmedCopy)
    } else if (madeAt > basedAt) {
      return subReducer(state, action)
    } else {
      return state
    }
  }
}
