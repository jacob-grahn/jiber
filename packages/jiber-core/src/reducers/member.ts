import { Action } from '../interfaces/action'
import { JOIN_ROOM, LEAVE_ROOM } from '../constants/action-types'
import { SERVER } from '../constants/source-types'
import { User } from '../interfaces/user'

/**
 * Keep track of a user who has joined this room
 */
export const member = (state: User|undefined, action: Action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {...action.$user}

    case LEAVE_ROOM:
      return undefined

    default:
      if (!state) return state
      if (action.$source !== SERVER) return state
      const newActionId = action.$actionId || 0
      const oldActionId = state.actionId || 0
      if (newActionId <= oldActionId) return state
      return {...state, actionId: newActionId}
  }
}
