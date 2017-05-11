import { Action } from '../../../core/index'
import HopeAction from '../../interfaces/hope-action'
import pruneActions from './prune-actions'
import {
  JOIN_RESULT,
  PEER_ACTION,
  CLIENT_ACTION,
  SERVER_ACTION
} from './room-actions'

export default function reducer (
  state: HopeAction[] = [],
  action: Action
): HopeAction[] {
  switch(action.type) {
    case JOIN_RESULT:
      return claimActions(state, action.myUserId)

    case PEER_ACTION:
      return [...state, action.action]

    case CLIENT_ACTION:
      return [...state, action.action]

    case SERVER_ACTION:
      return pruneActions(
        state,
        action.action.$hope.userId,
        action.action.$hope.actionId
      )

    default:
      return state
  }
}

/**
 * Assign a userId to actions that don't have a userId
 */
export function claimActions (
  actions: HopeAction[],
  userId: string
): HopeAction[] {
  return actions.map(action => {
    if (action.$hope.userId) {
      return action
    }
    return {...action, $hope: {...action.$hope, userId}}
  })
}
