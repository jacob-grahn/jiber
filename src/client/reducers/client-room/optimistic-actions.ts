import {
  HopeAction,
  CONFIRMED_STATE,
  REMOVE_MEMBER,
  CONFIRMED_ACTION
} from '../../../core/index'
import { OPTIMISTIC_ACTION } from './client-room'

export default function reducer (
  state: HopeAction[] = [],
  action: HopeAction
): HopeAction[] {
  const type = action.$hope.type || action.type
  switch (type) {
    case CONFIRMED_STATE:
      const state2 = claimActions(state, action.myUserId)
      const state3 = withoutNonMembers(state2, action.actionIds)
      return pruneActions(state3, action.actionIds)

    case REMOVE_MEMBER:
      return withoutUser(state, action.userId)

    case CONFIRMED_ACTION:
      const userId = action.$hope.userId || ''
      const actionId = action.$hope.actionId || 0
      return pruneActions(state, {[userId]: actionId})

    case OPTIMISTIC_ACTION:
      return [...state, action]

    default:
      return state
  }
}

// Assign a userId to actions that don't have a userId
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

// Remove actions that have the same userId, and a lesser or equal actionId
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

// remove optimistic actions that belong to users that are no longer members
function withoutNonMembers (
  actions: HopeAction[],
  actionIds: {[userId: string]: number}
): HopeAction[] {
  return actions.filter(action => actionIds[action.$hope.userId])
}

// remove actions belonging to userId
function withoutUser (actions: HopeAction[], userId: string): HopeAction[] {
  return actions.filter(action => action.$hope.userId !== userId)
}
