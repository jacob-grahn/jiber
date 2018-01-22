import { Reducer, Action, STATE, SERVER } from 'jiber-core'

/**
 * Use the current  state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * @hidden
 */
export const createOptimistic = (subReducer: Reducer) => {
  return (
    State: {pendingActions: Action[], confirmed: any, optimistic: any},
    action: Action
  ) => {
    const state = State.optimistic

    if (action.type === STATE) {
      const { pendingActions } = State
      return pendingActions.reduce(subReducer, State.confirmed)
    }

    if (action.$src !== SERVER) {
      const { pendingActions, confirmed } = State

      // copy is not needed if reducer does not mutate state
      // this could possibly be optional via the settings
      // it is just a pain to always write code that does not mutate
      const confirmedCopy = confirmed ? JSON.parse(JSON.stringify(confirmed)) : confirmed
      return pendingActions.reduce(subReducer, confirmedCopy)
    } else if (action.$madeAt || 0 > state.watchers[action.$uid].time) {
      return subReducer(state, action)
    } else {
      return state
    }
  }
}
