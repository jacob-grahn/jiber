import { Action, Reducer, SERVER } from '../../../core/index'
import { JOIN_RESULT } from './room-actions'

const namespace = 'hope/room'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    switch(action.type) {
      case JOIN_RESULT:
        return action.confirmedState

      default:
        if (action.type.indexOf(namespace) === 0) {                             // Ignore internal actions
          return state
        }

        if (action.$hope && action.$hope.source === SERVER) {
          return subReducer(state, action)
        }

        return state
    }
  }
}
