import { Action, STATE, CLOSE, OPEN, SERVER } from 'jiber-core'

/**
 * Remove actions that have the same uid, and a lesser or equal actionId
 * Actions with no $user are assumed to belong to the currently logged in user
 * @hidden
 */
const pruneOld = (optimisticActions: Action[], action: Action): Action[] => {
  return optimisticActions.filter(pendingAction => {
    if (!pendingAction.$uid) return false
    if (pendingAction.$uid !== action.$uid) return true
    return (pendingAction.$madeAt || 0) > (action.$madeAt || 0)
  })
}

/**
 * add a new pending action if it is newer than the last confirmed action
 * received for this user
 * @hidden
 */
const addNew = (optimisticActions: Action[], action: Action): Action[] => {
  // ignore OPEN and CLOSE actions, on-server-message.ts handles that
  if (action.type === OPEN || action.type === CLOSE) {
    return optimisticActions
  }

  return [...optimisticActions, action]
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

    // Remove pending actions belonging to uid if they leave the
    case CLOSE:
      return state.filter(pendingAction => pendingAction.$uid !== action.$uid)

    // Add or remove specific pending actions
    default:
      if (action.$src === SERVER) {
        return pruneOld(state, action)
      } else {
        return addNew(state, action)
      }
  }
}
