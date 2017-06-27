import { Action, Reducer, SERVER } from '../../core/index'
import { CONFIRMED_STATE } from './room-actions'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    if (action.type === CONFIRMED_STATE) {
      return action.confirmedState
    }

    if (action.$hope.source === SERVER && action.$hope.actionId) {              // confirmed action
      return subReducer(state, action)
    }

    return state
  }
}
