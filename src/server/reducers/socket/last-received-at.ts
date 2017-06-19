import { Action } from '../../../core/index'
import { RECEIVE } from './socket'

export default function lastReceivedAt (
  state: number = 0,
  action: Action
): number {
  switch (action.type) {
    case RECEIVE:
      return action.timeMs

    default:
      return state
  }
}
