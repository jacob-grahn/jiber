import { Action, CLIENT, SERVER, PEER } from '../../core/index'
import HopeAction from '../interfaces/hope-action'
import { JOIN_RESULT, isRoomAction } from './room-actions'

export default function reducer (
  state: HopeAction[] = [],
  action: HopeAction
): HopeAction[] {
  switch(action.type) {
    case JOIN_RESULT:
      return claimActions(state, action.myUserId)

    default:
      if (isRoomAction(action.type)) {                                          // Ignore internal actions
        return state
      }

      if (action.$hope.source === CLIENT) {                                     // untrusted local client actions
        return [...state, action]
      }

      if (action.$hope.source === PEER) {                                       // untrusted peer actions
        return [...state, action as HopeAction]
      }

      if (action.$hope.source === SERVER) {                                     // trusted server actions
        return pruneActions(
          state,
          action.$hope.userId,
          action.$hope.actionId
        )
      }

      return state
  }
}

/**
 * Assign a userId to actions that don't have a userId
 */
function claimActions (
  actions: HopeAction[],
  userId: string
): HopeAction[] {
  return actions.map(action => {
    if (action.$hope && action.$hope.userId) {
      return action
    }
    return {...action, $hope: {...action.$hope, userId}}
  })
}

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 */
function pruneActions (
  actions: HopeAction[],
  userId: String,
  actionId: number
): HopeAction[] {
  return actions.filter(action => {
    return (
      action && action.$hope && action.$hope.userId && action.$hope.actionId
      && (action.$hope.userId !== userId || action.$hope.actionId > actionId)
    )
  })
}
