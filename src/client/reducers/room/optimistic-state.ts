import { Reducer, Action, CLIENT, SERVER, PEER } from '../../../core/index'
import { JOIN_RESULT } from './room-actions'
import HopeAction from '../../interfaces/hope-action'
import addMeta from '../../utils/add-meta'
import nextActionId from '../../utils/next-action-id'

const namespace = 'hope/room'

export default function optimisticStateFactory (
  subReducer: Reducer,
) {
  return function optimisticState (
    state: any = undefined,
    action: Action,
    roomState: {optimisticActions: HopeAction[], confirmedState: any},
  ): any {
    switch (action.type) {
      case JOIN_RESULT:
        const actions = roomState.optimisticActions || []
        return actions.reduce(subReducer, action.confirmedState)

      default:
        if (action.type.indexOf(namespace) === 0) {
          return state
        }

        if (!action.$hope.source || action.$hope.source === CLIENT) {           // untrusted local client actions
          const hopeAction = addMeta(roomState, action)
          return subReducer(state, hopeAction)
        }

        if (action.$hope.source === SERVER) {                                   // trusted server actions
          const optimisticActions = roomState.optimisticActions || []
          const confirmedState = roomState.confirmedState
          return optimisticActions.reduce(subReducer, confirmedState)
        }

        if (action.$hope.source === PEER) {                                     // untrusted peer actions
          const hope = action.$hope
          const expectedActionId = nextActionId(hope.userId, roomState)
          const receivedActionId = hope.actionId
          if (receivedActionId !== expectedActionId) return state
          return subReducer(state, action)
        }

        return state
    }
  }
}
