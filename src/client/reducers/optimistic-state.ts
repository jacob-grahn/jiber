import { Reducer, Action, CLIENT, SERVER, PEER } from '../../core/index'
import { JOIN_RESULT, isRoomAction } from './room-actions'
import HopeAction from '../interfaces/hope-action'
import nextActionId from '../utils/next-action-id'

export default function optimisticStateFactory (
  subReducer: Reducer
) {
  return function optimisticState (
    state: any = undefined,
    action: HopeAction,
    roomState: {optimisticActions: HopeAction[], confirmedState: any}
  ): any {
    switch (action.type) {
      case JOIN_RESULT:
        const actions = roomState.optimisticActions || []
        return actions.reduce(subReducer, action.confirmedState)

      default:
        if (isRoomAction(action.type)) {                                        // Ignore internal actions
          return state
        }

        if (action.$hope.source === CLIENT) {                                   // Untrusted local client actions
          return subReducer(state, action)
        }

        if (action.$hope.source === PEER) {                                     // Untrusted peer actions
          return subReducer(state, action)
        }

        if (action.$hope.source === SERVER) {                                   // Trusted server actions
          const { optimisticActions, confirmedState } = roomState
          return optimisticActions.reduce(subReducer, confirmedState)
        }

        return state
    }
  }
}
