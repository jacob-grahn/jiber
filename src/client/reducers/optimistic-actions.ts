import { Action, CLIENT, SERVER, PEER } from '../../core/index'
import HopeAction from '../interfaces/hope-action'
import { JOIN_RESULT, REMOVE_MEMBER, isRoomAction } from './room-actions'

export default function reducer (
  state: HopeAction[] = [],
  action: HopeAction
): HopeAction[] {
  switch (action.type) {
    case JOIN_RESULT:
      const state2 = claimActions(state, action.myUserId)
      const state3 = withoutNonMembers(state2, action.memberIds)
      return pruneActions(state3, action.actionIds)

    case REMOVE_MEMBER:
      return withoutUser(state, action.userId)

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
          {[action.$hope.userId]: action.$hope.actionId}
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
  actionIds: {[key: string]: number}
): HopeAction[] {
  return actions.filter(action => {
    if (!action || !action.$hope) {                                             // remove when there is no $hope metadata
      return false
    }
    const meta = action.$hope

    if (!meta.userId || !meta.actionId) {                                       // remove if the metadata doesn't contain needed values
      return false
    }
    if (actionIds[meta.userId] >= meta.actionId) {                              // remove if a newer or equal action has been confirmed
      return false
    }

    return true                                                                 // the optimistic action may stay :)
  })
}

/**
 * remove optimistic actions that are not in memberIds
 */
function withoutNonMembers (
  actions: HopeAction[],
  memberIds: string[]
): HopeAction[] {
  return actions.filter(action => memberIds.indexOf(action.$hope.userId) !== -1)
}

/**
 * remove actions belonging to userId
 */
function withoutUser (actions: HopeAction[], userId: string): HopeAction[] {
  return actions.filter(action => action.$hope.userId !== userId)
}
