import { Action, SERVER } from '../../core/index'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE
} from './room-actions'

export default function reducer (
  state: {[key: string]: number} = {},
  action: Action
): {[key: string]: number} {
  if (action.type === CONFIRMED_STATE) {
    return action.actionIds
  }

  if (action.type === JOIN_ROOM) {
    if (state[action.$hope.userId]) return state                                // no need to be added twice
    return {...state, [action.$hope.userId]: action.actionId || 0}              // add the userId to the collection
  }

  if (action.type === LEAVE_ROOM) {
    const newState = {...state}
    delete newState[action.$hope.userId]
    return newState
  }

  if (action.$hope.source === SERVER && action.$hope.actionId) {                // confirmed action
    return {...state, [action.$hope.userId]: action.$hope.actionId}
  }

  return state
}
