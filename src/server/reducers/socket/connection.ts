import { Action, INIT_SOCKET } from '../../../core/index'
import Socket from '../../interfaces/socket'

export default function connection (
  state: Socket|undefined = undefined,
  action: Action
): Socket|undefined {
  switch (action.type) {
    case INIT_SOCKET:
      return action.connection

    default:
      return state
  }
}
