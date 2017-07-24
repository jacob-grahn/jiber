import Action from '../interfaces/action'
import { CONFIRMED_STATE, CONFIRM_ACTION, PATCH } from '../../core/index'

export default function lastUpdatedAt (
  state: number = 0,
  action: Action
): number {
  switch (action.type) {
    case CONFIRMED_STATE:
      return action.lastUpdatedAt

    case CONFIRM_ACTION:
      if (!action.$hope) return state
      return action.$hope.timeMs || 0

    case PATCH:
      if (!action.$hope) return state
      return action.$hope.timeMs || 0

    default:
      return state
  }
}
