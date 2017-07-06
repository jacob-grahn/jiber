import { Action } from '../../core/index'
import { CONFIRMED_STATE } from './room-actions'

export default function lastUpdatedAt (
  state: number = 0,
  action: Action
): number {
  if (action.type === CONFIRMED_STATE) {
    return action.lastUpdatedAt
  }

  if (action.$hope && action.$hope.source === 'SERVER' && action.$hope.timeMs) {           // confirmed action
    return action.$hope.timeMs
  }

  return state
}
