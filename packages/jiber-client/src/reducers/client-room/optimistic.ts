import { Reducer, Action, CONFIRMED_STATE, SERVER } from 'jiber-core'

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

    if (action.$source === SERVER) {                                            // confirmed action
      const { pendingActions, confirmed } = roomState
      return pendingActions.reduce(subReducer, confirmed)
    } else {                                                                    // optimistic action
      return subReducer(state, action)
    }
  }
}
