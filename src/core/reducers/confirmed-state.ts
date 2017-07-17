import Action from '../interfaces/action'
import Reducer from '../interfaces/reducer'
import { CONFIRMED_STATE } from './room-actions'
import isConfirmedAction from '../utils/is-confirmed-action'

export default function (subReducer: Reducer): Reducer {
  return function confirmedState (state: any = undefined, action: Action): any {
    if (action.type === CONFIRMED_STATE) {
      return action.confirmedState
    }

    if (isConfirmedAction(action)) {
      return subReducer(state, action)
    }

    return state
  }
}
