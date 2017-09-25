// todo: shouldn't reducers/users and reducers/members be pretty much the same?

import { Action } from '../interfaces/action'
import { User } from '../interfaces/user'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE
} from '../constants/action-types'
import { SERVER } from '../constants/source-types'
import { createDictionary } from './dictionary'

/**
 * Keep track of a user who has joined this room
 */
const member = (
  state: User|undefined = undefined,
  action: Action
) => {
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

const memberDict = createDictionary(member, '$userId')

export const members = (
  state: {[userId: string]: User} = {},
  action: Action
): {[userId: string]: User} => {
  switch (action.type) {
    case CONFIRMED_STATE:
      return action.members

    default:
      return memberDict(state, action)
  }
}
