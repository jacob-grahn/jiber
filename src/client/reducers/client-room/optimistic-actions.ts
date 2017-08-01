import {
  Action,
  Member,
  CONFIRMED_STATE,
  LEAVE_ROOM,
  SERVER
} from '../../../core/index'

export default function reducer (
  state: Action[] = [],
  action: Action
): Action[] {
  switch (action.type) {

    case CONFIRMED_STATE:
      const state2 = claimActions(state, action.myUserId)
      const state3 = withoutNonMembers(state2, action.members)
      return pruneActions(state3, action.members)

    case LEAVE_ROOM:
      return withoutUser(state, action.userId)

    default:
      if (action.$source === SERVER) {
        const userId = action.$userId
        const actionId = action.$actionId
        if (!userId || !actionId) return state
        return pruneActions(state, {[userId]: {actionId}})
      }
      return [...state, action]
  }
}

// Assign a userId to actions that don't have a userId
function claimActions (
  actions: Action[],
  $userId: string
): Action[] {
  return actions.map(action => {
    if (action.$userId) return action
    return {...action, $userId}
  })
}

// Remove actions that have the same userId, and a lesser or equal actionId
function pruneActions (
  actions: Action[],
  members: {[userId: string]: Member}
): Action[] {
  return actions.filter(action => {
    if (!action) return false
    const userId = action.$userId
    const actionId = action.$actionId

    if (!userId || !actionId) {                                                 // remove if the metadata doesn't contain needed values
      return false
    }

    const member = members[userId]
    if (member && member.actionId >= actionId) {                                // remove if a newer or equal action has been confirmed
      return false
    }

    return true                                                                 // the optimistic action may stay :)
  })
}

// remove optimistic actions that belong to users that are no longer members
function withoutNonMembers (
  actions: Action[],
  members: {[userId: string]: number}
): Action[] {
  return actions.filter(action => {
    if (!action.$userId) return false
    return members[action.$userId]
  })
}

// remove actions belonging to userId
function withoutUser (actions: Action[], userId: string): Action[] {
  return actions.filter(action => action.$userId !== userId)
}
