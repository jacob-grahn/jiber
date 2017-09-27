import { Action } from '../interfaces/action'
import { User } from '../interfaces/user'
import { CONFIRMED_STATE } from '../constants/action-types'
import { createDictionary } from './dictionary'
import { member } from './member'

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
