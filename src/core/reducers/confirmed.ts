import Action from '../interfaces/action'
import Reducer from '../interfaces/reducer'
import patch from '../utils/patch'
import {
  PATCH,
  CONFIRM_ACTION,
  CONFIRMED_STATE
} from '../constants/action-types'

export default function (subReducer: Reducer): Reducer {
  return function confirmed (state: any = undefined, action: Action): any {
    switch (action.type) {

      case CONFIRMED_STATE:
        return action.confirmed

      case CONFIRM_ACTION:
        return subReducer(state, action.action)

      case PATCH:
        return patch(state, action.confirmed)

      default:
        return state
    }
  }
}
