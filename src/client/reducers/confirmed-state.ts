import { Action, Reducer, SERVER } from '../../core/index'
import { JOIN_RESULT, CONFIRMED_ACTION } from './room-actions'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    switch (action.type) {
      case JOIN_RESULT:
        return action.confirmedState

      case CONFIRMED_ACTION:
        return subReducer(state, {...action, type: action.$hope.type})

      default:
        return state
    }
  }
}
