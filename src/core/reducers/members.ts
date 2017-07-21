import Action from '../interfaces/action'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE,
  DIFF
} from './room-actions'
import isConfirmedAction from '../utils/is-confirmed-action'
import patch from '../utils/patch'

export interface MembersState {
  [userId: string]: {actionId: number}
}

export default function reducer (
  state: MembersState = {},
  action: Action
): MembersState {
  if (!action.$hope) {
    return state
  }

  if (action.type === CONFIRMED_STATE) {
    return action.members
  }

  if (action.type === JOIN_ROOM) {
    if (!action.$hope.userId) return state
    if (state[action.$hope.userId]) return state                                // no need to be added twice
    return {...state, [action.$hope.userId]: {actionId: 0}}                     // add the userId to the collection
  }

  if (action.type === LEAVE_ROOM) {
    if (!action.$hope.userId) return state
    const newState = {...state}
    delete newState[action.$hope.userId]
    return newState
  }

  if (action.type === DIFF) {
    return patch(state, action.members)
  }

  if (isConfirmedAction(action)) {
    if (!action.$hope.userId) return state
    const userId = action.$hope.userId
    const actionId = action.$hope.actionId
    const user = state[userId] || {}
    const updatedUser = {...user, actionId}
    return {...state, [userId]: updatedUser}
  }

  return state
}
