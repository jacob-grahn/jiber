import { Action, SERVER } from '../../../core/index'
import {
  ADD_MEMBER,
  REMOVE_MEMBER,
  JOIN_RESULT,
  isRoomAction
} from './room-actions'

export default function reducer (
  state: {[key: string]: number} = {},
  action: Action
): {[key: string]: number} {
  switch (action.type) {
    case JOIN_RESULT:
      return action.actionIds

    case ADD_MEMBER:
      if (state[action.userId]) return state                                    // no need to be added twice
      return {...state, [action.userId]: action.actionId || 0}                  // add the userId to the memberIds list

    case REMOVE_MEMBER:
      return {...state, [action.userId]: undefined}

    default:
      if (isRoomAction(action.type)) {                                          // Ignore internal actions
        return state
      }

      if (action.$hope && action.$hope.source === SERVER) {                     // trust actionId sent from server
        const meta = action.$hope
        return {...state, [meta.userId]: meta.actionId}
      }

      return state
  }
}
