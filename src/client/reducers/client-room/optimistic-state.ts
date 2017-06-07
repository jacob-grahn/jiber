import {
  Reducer,
  HopeAction,
  CONFIRMED_STATE,
  CONFIRMED_ACTION
} from '../../../core/index'
import { OPTIMISTIC_ACTION } from './client-room'

export default function createOptimisticState (
  subReducer: Reducer
) {
  return function optimisticState (
    state: any = undefined,
    action: HopeAction,
    roomState: {optimisticActions: HopeAction[], confirmedState: any}
  ): any {
    const type = action.$hope.type || action.type
    switch (type) {
      case CONFIRMED_STATE:
        const actions = roomState.optimisticActions || []
        return actions.reduce(subReducer, action.confirmedState)

      case OPTIMISTIC_ACTION:
        return subReducer(state, action)

      case CONFIRMED_ACTION:
        const { optimisticActions, confirmedState } = roomState
        return optimisticActions.reduce(subReducer, confirmedState)

      default:
        return state
    }
  }
}
