import { Action } from '../../../core/index'
import { SEND } from './socket'

export default function lastSentAt (
  state: number = 0,
  action: Action
): number {
  switch (action.type) {
    case SEND:
      return action.timeMs

    default:
      return state
  }
}
