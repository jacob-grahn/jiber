import Action from '../interfaces/action'
import {
  CONFIRMED_STATE,
  CONFIRM_ACTION,
  PATCH
} from '../constants/action-types'

export default function lastUpdatedAt (
  state: number = 0,
  action: Action
): number {
  switch (action.type) {
    case CONFIRMED_STATE:
      return action.lastUpdatedAt

    case CONFIRM_ACTION:
      if (!action.$hope || !action.$hope.timeMs) return state
      return action.$hope.timeMs

    case PATCH:
      return action.lastUpdatedAt

    default:
      return state
  }
}
