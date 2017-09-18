import { Action } from '../interfaces/action'
import { UserDict } from '../interfaces/user-dict'
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
  state: {actionId: number}|undefined = undefined,
  action: Action
) => {
  switch (action.type) {
    case JOIN_ROOM:
      if (state) return state                                                   // no need to be added twice
      return {...action.$user, actionId: 0}

    case LEAVE_ROOM:
      return undefined

    default:
      if (action.$source === SERVER && action.$actionId) {
        return {...state, actionId: action.$actionId}
      }
      return state
  }
}

const memberDict = createDictionary(member, '$userId')

export const members = (
  state: UserDict = {},
  action: Action
): UserDict => {
  switch (action.type) {
    case CONFIRMED_STATE:
      return action.members

    default:
      return memberDict(state, action)
  }
}
