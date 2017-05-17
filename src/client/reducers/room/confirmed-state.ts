import { Action, Reducer, SERVER } from '../../../core/index'
import { JOIN_RESULT, isRoomAction } from './room-actions'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    switch(action.type) {
      case JOIN_RESULT:
        return action.confirmedState

      default:
        if (isRoomAction(action.type)) {                             // Ignore internal actions
          return state
        }

        if (action.$hope && action.$hope.source === SERVER) {
          return subReducer(state, action)
        }

        return state
    }
  }
}
