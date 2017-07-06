import { Action } from '../../core/index'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE
} from './room-actions'
import isConfirmedAction from '../utils/is-confirmed-action'

export interface MembersState {
  [userId: string]: {actionId: number}
}

export default function reducer (
  state: MembersState = {},
  action: Action
): MembersState {
  if (action.type === CONFIRMED_STATE) {
    return action.members
  }

  if (action.type === JOIN_ROOM) {
    if (state[action.$hope.userId]) return state                                // no need to be added twice
    return {...state, [action.$hope.userId]: {actionId: 0}}                     // add the userId to the collection
  }

  if (action.type === LEAVE_ROOM) {
    const newState = {...state}
    delete newState[action.$hope.userId]
    return newState
  }

  if (isConfirmedAction(action)) {
    const userId = action.$hope.userId
    const actionId = action.$hope.actionId
    const user = state[userId] || {}
    const updatedUser = {...user, actionId}
    return {...state, [userId]: updatedUser}
  }

  return state
}
