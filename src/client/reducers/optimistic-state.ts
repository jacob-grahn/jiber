import { Reducer, Action, HopeAction, CLIENT, SERVER, PEER } from '../../core/index'
import { JOIN_RESULT, OPTIMISTIC_ACTION, CONFIRMED_ACTION } from './room-actions'
import nextActionId from '../utils/next-action-id'

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
      case JOIN_RESULT:
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
