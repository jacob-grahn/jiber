import { Reducer, Action, CLIENT, SERVER, PEER } from '../../../core/index'
import { JOIN_RESULT } from './room-actions'
import HopeAction from '../../interfaces/hope-action'
import nextActionId from '../../utils/next-action-id'

const namespace = 'hope/room'

export default function optimisticStateFactory (
  subReducer: Reducer,
) {
  return function optimisticState (
    state: any = undefined,
    action: HopeAction,
    roomState: {optimisticActions: HopeAction[], confirmedState: any},
  ): any {
    switch (action.type) {
      case JOIN_RESULT:
        const actions = roomState.optimisticActions || []
        return actions.reduce(subReducer, action.confirmedState)

      default:
        if (action.type.indexOf(namespace) === 0) {                             // Ignore internal actions
          return state
        }

        if (action.$hope.source === CLIENT) {                                   // untrusted local client actions
          return subReducer(state, action)
        }

        if (action.$hope.source === PEER) {                                     // untrusted peer actions
          return subReducer(state, action)
        }

        if (action.$hope.source === SERVER) {                                   // trusted server actions
          const { optimisticActions, confirmedState } = roomState
          return optimisticActions.reduce(subReducer, confirmedState)
        }

        return state
    }
  }
}
