import { Reducer, Action, STATE, get } from 'jiber-core'

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

    const curActionId = get(action, '$user.actionId') || 0
    const actionId = action.$actionId || 0

    if (action.$confirmed) {
      const { pendingActions, confirmed } = State

      // copy is not needed if reducer does not mutate state
      // this could possibly be optional via the settings
      // it is just a pain to always write code that does not mutate
      const confirmedCopy = JSON.parse(JSON.stringify(confirmed))
      return pendingActions.reduce(subReducer, confirmedCopy)
    } else if (actionId > curActionId) {
      return subReducer(state, action)
    } else {
      return state
    }
  }
}
