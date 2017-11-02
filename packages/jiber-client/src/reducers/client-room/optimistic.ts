// TODO: fix this

import { Reducer, Action, CONFIRMED_STATE, get } from 'jiber-core'

/**
 * Use the current room state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
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

    if (action.$confirmed) {
      const { pendingActions, confirmed } = roomState
      return pendingActions.reduce(subReducer, confirmed)
    } else if (get(action, '$id') > get(action, '$user.actionId')) {
      return subReducer(state, action)
    } else {
      return state
    }
  }
}
