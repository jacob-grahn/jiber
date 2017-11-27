import { Action, CONFIRMED_STATE, LEAVE_ROOM, JOIN_ROOM } from 'jiber-core'

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 * Actions with no $user are assumed to belong to the currently logged in user
 */
const pruneOld = (pendingActions: Action[], action: Action): Action[] => {
  return pendingActions.filter(pendingAction => {
    if (!pendingAction.$userId) return false
    if (pendingAction.$userId !== action.$userId) return true
    return (pendingAction.$actionId || 0) > (action.$actionId || 0)
  })
}

/**
 * add a new pending action if it is newer than the last confirmed action
 * received for this user
 */
const addNew = (pendingActions: Action[], action: Action): Action[] => {
  // ignore JOIN_ROOM and LEAVE_ROOM actions, rejoin-rooms.ts handles that
  if (action.type === JOIN_ROOM || action.type === LEAVE_ROOM) {
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
 */
export const pendingActions = (
  state: Action[] = [],
  action: Action
): Action[] => {
  switch (action.type) {
    // Remove all pending actions
    case CONFIRMED_STATE:
      return []

    // Remove pending actions belonging to userId if they leave the room
    case LEAVE_ROOM:
      return state.filter(pendingAction => pendingAction.$userId !== action.$userId)

    // Add or remove specific pending actions
    default:
      return action.$confirmed ? pruneOld(state, action) : addNew(state, action)
  }
}
