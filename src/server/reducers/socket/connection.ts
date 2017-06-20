import { Action } from '../../../core/index'
import Socket from '../../interfaces/socket'
import { INIT } from './socket'

export default function connection (
  state: Socket|undefined = undefined,
  action: Action
): Socket|undefined {
  switch (action.type) {
    case INIT:
      return action.connection

    default:
      return state
  }
}
