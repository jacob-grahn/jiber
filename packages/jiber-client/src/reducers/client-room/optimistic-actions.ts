import {
  Action,
  User,
  CONFIRMED_STATE,
  LEAVE_ROOM,
  SERVER
} from 'jiber-core'

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 * Actions with no $user are assumed to belong to the currently logged in user
 */
const pruneByActionId = (actions: Action[], user: User): Action[] => {
  return actions.filter(action => {
    if (!action) return false
    if (!action.$userId) return false
    if (action.$userId !== user.userId) return true
    return (action.$actionId || 0) > (user.actionId || 0)
  })
}

/**
 * Remove actions belonging to userId
 */
const pruneByUser = (actions: Action[], userId: string): Action[] => {
  return actions.filter(action => action.$userId !== userId)
}

/**
 * Keep optimistic actions that have not been confirmed by the server yet
 */
export const optimisticActions = (
  state: Action[] = [],
  action: Action
): Action[] => {
  switch (action.type) {
    case CONFIRMED_STATE:
      return []

    case LEAVE_ROOM:
      return pruneByUser(state, action.userId)

    default:
      if (action.$source === SERVER) {
        if (!action.$user) return state
        return pruneByActionId(state, action.$user)
      }
      return [...state, action]
  }
}
