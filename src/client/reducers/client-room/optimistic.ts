import {
  Reducer,
  Action,
  CONFIRMED_STATE,
  PATCH,
  SERVER
} from '../../../core/index'

/**
 * Use the current room state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * todo: I don't know why PATCH is in here
 */
export const createOptimistic = (subReducer: Reducer) => {
  return (
    state: any = undefined,
    action: Action,
    roomState: {optimisticActions: Action[], confirmed: any}
  ) => {
    if (action.type === CONFIRMED_STATE || action.type === PATCH) {
      const { optimisticActions } = roomState
      return optimisticActions.reduce(subReducer, roomState.confirmed)
    }

    if (action.$source === SERVER) {                                            // confirmed action
      const { optimisticActions, confirmed } = roomState
      return optimisticActions.reduce(subReducer, confirmed)
    } else {                                                                    // optimistic action
      return subReducer(state, action)
    }
  }
}
