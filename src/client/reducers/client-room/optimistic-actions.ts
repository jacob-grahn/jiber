import {
  isConfirmedAction,
  Action,
  Member,
  CONFIRMED_STATE,
  LEAVE_ROOM
} from '../../../core/index'

export default function reducer (
  state: Action[] = [],
  action: Action
): Action[] {
  if (!action.$hope) {
    return state
  }

  if (action.type === CONFIRMED_STATE) {
    const state2 = claimActions(state, action.myUserId)
    const state3 = withoutNonMembers(state2, action.members)
    return pruneActions(state3, action.members)
  }

  if (action.type === LEAVE_ROOM) {
    return withoutUser(state, action.userId)
  }

  if (isConfirmedAction(action)) {                                              // confirmed action
    const userId = action.$hope.userId || ''
    const actionId = action.$hope.actionId || 0
    return pruneActions(state, {[userId]: {actionId}})
  }

  if (action.$hope && action.$hope.actionId) {                                  // optimistic action
    return [...state, action]
  }

  return state
}

// Assign a userId to actions that don't have a userId
function claimActions (
  actions: Action[],
  userId: string
): Action[] {
  return actions.map(action => {
    if (action.$hope && action.$hope.userId) {
      return action
    }
    return {...action, $hope: {...action.$hope, userId}}
  })
}

// Remove actions that have the same userId, and a lesser or equal actionId
function pruneActions (
  actions: Action[],
  members: {[userId: string]: Member}
): Action[] {
  return actions.filter(action => {
    if (!action || !action.$hope) {                                             // remove when there is no $hope metadata
      return false
    }
    const userId = action.$hope.userId
    const actionId = action.$hope.actionId

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
    if (!action.$hope || !action.$hope.userId) return false
    return members[action.$hope.userId]
  })
}

// remove actions belonging to userId
function withoutUser (actions: Action[], userId: string): Action[] {
  return actions.filter(action => {
    if (!action.$hope) return false
    return action.$hope.userId !== userId
  })
}
