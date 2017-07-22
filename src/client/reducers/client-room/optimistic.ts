import {
  Reducer,
  Action,
  CONFIRM_ACTION,
  CONFIRMED_STATE,
  PATCH
} from '../../../core/index'

export default function createOptimisticState (
  subReducer: Reducer
) {
  return function optimistic (
    state: any = undefined,
    action: Action,
    roomState: {optimisticActions: Action[], confirmed: any}
  ): any {
    if (action.type === CONFIRMED_STATE || action.type === PATCH) {
      const { optimisticActions } = roomState
      return optimisticActions.reduce(subReducer, roomState.confirmed)
    }

    if (action.type === CONFIRM_ACTION) {                                       // confirmed action
      const { optimisticActions, confirmed } = roomState
      return optimisticActions.reduce(subReducer, confirmed)
    }

    if (action.$hope && action.$hope.actionId) {                                // optimistic action
      return subReducer(state, action)
    }

    return state
  }
}
