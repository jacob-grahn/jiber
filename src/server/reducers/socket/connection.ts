import { Action, INIT_SOCKET } from '../../../core/index'
import * as ws from 'ws'

export default function connection (
  state: ws|undefined = undefined,
  action: Action
): ws|undefined {
  switch (action.type) {
    case INIT_SOCKET:
      return action.connection

    default:
      return state
  }
}
