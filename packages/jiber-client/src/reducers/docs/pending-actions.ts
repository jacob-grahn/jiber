import { Action, STATE, LEAVE_ROOM, OPEN } from 'jiber-core'

/**
 * Remove actions that have the same uid, and a lesser or equal actionId
 * Actions with no $user are assumed to belong to the currently logged in user
 * @hidden
 */
const pruneOld = (pendingActions: Action[], action: Action): Action[] => {
  return pendingActions.filter(pendingAction => {
    if (!pendingAction.$uid) return false
    if (pendingAction.$uid !== action.$uid) return true
    return (pendingAction.$actionId || 0) > (action.$actionId || 0)
  })
}

/**
 * add a new pending action if it is newer than the last confirmed action
 * received for this user
 * @hidden
 */
const addNew = (pendingActions: Action[], action: Action): Action[] => {
  // ignore OPEN and LEAVE_ROOM actions, rejoin-rooms.ts handles that
  if (action.type === OPEN || action.type === LEAVE_ROOM) {
    return pendingActions
  }

  // if the user is not set, then we made this action but are not logged in yet
  if (!action.$user) return [...pendingActions, action]

  // only accept optimistic actions that are newer than the confirmed actions
  if ((action.$actionId || 0) > (action.$user.actionId || 0)) {
    return [...pendingActions, action]
  } else {
    return pendingActions
  }
}

/**
 * Keep optimistic actions that have not been confirmed by the server yet
 * @hidden
 */
export const pendingActions = (
  state: Action[] = [],
  action: Action
): Action[] => {
  switch (action.type) {
    // Remove all pending actions
    case STATE:
      return []

    // Remove pending actions belonging to uid if they leave the room
    case LEAVE_ROOM:
      return state.filter(pendingAction => pendingAction.$uid !== action.$uid)

    // Add or remove specific pending actions
    default:
      return action.$confirmed ? pruneOld(state, action) : addNew(state, action)
  }
}
