import { Reducer, Action, CONFIRMED_STATE, get } from 'jiber-core'

/**
 * Use the current room state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * @hidden
 */
export const createOptimistic = (subReducer: Reducer) => {
  return (
    roomState: {pendingActions: Action[], confirmed: any, optimistic: any},
    action: Action
  ) => {
    const state = roomState.optimistic

    if (action.type === CONFIRMED_STATE) {
      const { pendingActions } = roomState
      return pendingActions.reduce(subReducer, roomState.confirmed)
    }

    const curActionId = get(action, '$user.actionId') || 0
    const actionId = action.$actionId || 0

    if (action.$confirmed) {
      const { pendingActions, confirmed } = roomState

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
