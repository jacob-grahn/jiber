import {
  isConfirmedAction,
  Reducer,
  HopeAction,
  CONFIRMED_STATE
} from '../../../core/index'

export default function createOptimisticState (
  subReducer: Reducer
) {
  return function optimisticState (
    state: any = undefined,
    action: HopeAction,
    roomState: {optimisticActions: HopeAction[], confirmedState: any}
  ): any {
    if (action.type === CONFIRMED_STATE) {
      const { optimisticActions } = roomState
      return optimisticActions.reduce(subReducer, action.confirmedState)
    }

    if (isConfirmedAction(action)) {                                            // confirmed action
      const { optimisticActions, confirmedState } = roomState
      return optimisticActions.reduce(subReducer, confirmedState)
    }

    if (action.$hope && action.$hope.actionId) {                                // optimistic action
      return subReducer(state, action)
    }

    return state
  }
}
