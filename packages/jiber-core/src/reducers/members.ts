import { Action } from '../interfaces/action'
import { UserDict } from '../interfaces/user-dict'
import { CONFIRMED_STATE } from '../constants/action-types'
import { SERVER } from '../constants/sources'
import { createDictionary } from './dictionary'
import { member } from './member'

const memberDict = createDictionary(member, '$userId')

export const members = (state: UserDict = {}, action: Action): UserDict => {
  if (action.type === CONFIRMED_STATE && action.$source === SERVER) {
    return action.members
  }
  return memberDict(state, action)
}
