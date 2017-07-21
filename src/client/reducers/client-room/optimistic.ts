import {
  isConfirmedAction,
  Reducer,
  Action,
  CONFIRMED_STATE
} from '../../../core/index'

export default function createOptimisticState (
  subReducer: Reducer
) {
  return function optimisticState (
    state: any = undefined,
    action: Action,
    roomState: {optimisticActions: Action[], confirmed: any}
  ): any {
    if (action.type === CONFIRMED_STATE) {
      const { optimisticActions } = roomState
      return optimisticActions.reduce(subReducer, action.confirmedState)
    }

    if (isConfirmedAction(action)) {                                            // confirmed action
      const { optimisticActions, confirmed } = roomState
      return optimisticActions.reduce(subReducer, confirmed)
    }

    if (action.$hope && action.$hope.actionId) {                                // optimistic action
      return subReducer(state, action)
    }

    return state
  }
}
