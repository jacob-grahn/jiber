import { Action, Reducer } from '../../core/index'
import { CONFIRMED_STATE, CONFIRMED_ACTION } from './room-actions'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    const type = action.$hope.type || action.type
    switch (type) {
      case CONFIRMED_STATE:
        return action.confirmedState

      case CONFIRMED_ACTION:
        return subReducer(state, action)

      default:
        return state
    }
  }
}
