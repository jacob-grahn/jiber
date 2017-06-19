import { Action } from '../../../core/index'
import { INIT } from './socket'

export default function connectedAt (
  state: number = 0,
  action: Action
): number {
  switch (action.type) {
    case INIT:
      return action.timeMs

    default:
      return state
  }
}
