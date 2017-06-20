import { Action } from '../../core/index'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE,
  CONFIRMED_ACTION
} from './room-actions'

export default function reducer (
  state: {[key: string]: number} = {},
  action: Action
): {[key: string]: number} {
  const type = action.$hope.type || action.type
  switch (type) {
    case CONFIRMED_STATE:
      return action.actionIds

    case JOIN_ROOM:
      if (state[action.userId]) return state                                    // no need to be added twice
      return {...state, [action.userId]: action.actionId || 0}                  // add the userId to the collection

    case LEAVE_ROOM:
      return {...state, [action.userId]: undefined}

    case CONFIRMED_ACTION:                                                      // trust confirmed actionId
      const meta = action.$hope
      return {...state, [meta.userId]: meta.actionId}

    default:
      return state
  }
}
