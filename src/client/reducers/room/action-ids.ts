import { Action } from '../../../core/index'
import {
  ADD_MEMBER,
  REMOVE_MEMBER,
  JOIN_RESULT,
  SERVER_ACTION
} from './room-actions'

export default function reducer (
  state: {[key: string]: number} = {},
  action: Action
): {[key: string]: number} {
  switch (action.type) {
    case JOIN_RESULT:
      return action.actionIds

    case ADD_MEMBER:
      return  {...state, [action.userId]: action.actionId || 0}                 // otherwise, add the userId to the memberIds list

    case REMOVE_MEMBER:
      return {...state, [action.userId]: undefined}

    case SERVER_ACTION:
      const meta = action.action.$hope
      return {...state, [meta.userId]: meta.actionId}

    default:
      return state
  }
}
