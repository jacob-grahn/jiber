import { Action } from '../interfaces'
import { STATE, CLOSE, OPEN, SERVER } from '../constants'

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 * Actions with no $user are assumed to belong to the currently logged in user
 * @hidden
 */
const pruneOld = (optimisticActions: Action[], action: Action): Action[] => {
  return optimisticActions.filter(pendingAction => {
    if (!pendingAction.$userId) return false
    if (pendingAction.$userId !== action.$userId) return true
    return (pendingAction.$madeAt || 0) > (action.$madeAt || 0)
  })
}

/**
 * add a new pending action if it is newer than the last confirmed action
 * received for this user
 * @hidden
 */
const addNew = (optimisticActions: Action[], action: Action): Action[] => {
  // ignore OPEN and CLOSE actions, rejoin-s.ts handles that
  if (action.type === OPEN || action.type === CLOSE) {
    return optimisticActions
  }

  // if the user is not set, then we made this action but are not logged in yet
  if (!action.$user) return [...optimisticActions, action]

  // only accept optimistic actions that are newer than the confirmed actions
  if ((action.$actionId || 0) > (action.$user.actionId || 0)) {
    return [...optimisticActions, action]
  } else {
    return optimisticActions
  }
}

/**
 * Keep optimistic actions that have not been confirmed by the server yet
 * @hidden
 */
export const optimisticActions = (state: Action[] = [], action: Action): Action[] => {
  switch (action.type) {
    // Remove all pending actions
    case STATE:
      return []

    // Remove pending actions belonging to userId if they leave the
    case CLOSE:
      return state.filter(pendingAction => pendingAction.$userId !== action.$userId)

    // Add or remove specific pending actions
    default:
      if (action.$src === SERVER) {
        return pruneOld(state, action)
      } else {
        return addNew(state, action)
      }
  }
}
