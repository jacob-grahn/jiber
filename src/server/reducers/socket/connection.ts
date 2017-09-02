import { Action, INIT_SOCKET } from '../../../core/index'
import * as ws from 'ws'

/**
 * This is bad form for a reducer, but I don't see a better place to store
 * the socket connections at the moment.
 */
export const connection = (
  state: ws|undefined = undefined,
  action: Action
): ws|undefined => {
  switch (action.type) {
    case INIT_SOCKET:
      return action.connection
    default:
      return state
  }
}
