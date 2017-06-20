import { Action } from '../../core/index'
import { CONFIRMED_STATE, CONFIRMED_ACTION } from './room-actions'

export default function lastUpdatedAt (
  state: number = 0,
  action: Action
): number {
  const type = action.$hope.type || action.type
  switch (type) {
    case CONFIRMED_STATE:
      return action.lastUpdatedAt

    case CONFIRMED_ACTION:
      return action.$hope.timeMs

    default:
      return state
  }
}
