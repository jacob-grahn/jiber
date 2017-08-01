import {
  Reducer,
  Action,
  CONFIRMED_STATE,
  PATCH,
  SERVER
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

    if (action.$source === SERVER) {                                             // confirmed action
      const { optimisticActions, confirmed } = roomState
      return optimisticActions.reduce(subReducer, confirmed)
    } else {                                                                    // optimistic action
      return subReducer(state, action)
    }
  }
}
