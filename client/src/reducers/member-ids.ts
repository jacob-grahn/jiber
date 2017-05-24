import { Action } from '../../../core/index'
import { ADD_MEMBER, REMOVE_MEMBER, JOIN_RESULT } from './room-actions'

export default function reducer (
  state: string[] = [],
  action: Action
): string[] {
  switch (action.type) {
    case JOIN_RESULT:
      return action.memberIds

    case ADD_MEMBER:
      if (state.indexOf(action.userId) !== -1) return state                     // do nothing if the user is already a member of this room
      return [...state, action.userId]                                          // otherwise, add the userId to the memberIds list

    case REMOVE_MEMBER:
      return state.filter(userId => userId !== action.userId)

    default:
      return state
  }
}
