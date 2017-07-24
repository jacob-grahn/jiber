import Action from '../interfaces/action'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE,
  PATCH,
  CONFIRM_ACTION
} from '../constants/action-types'
import patch from '../utils/patch'

export interface MembersState {
  [userId: string]: {actionId: number}
}

export default function reducer (
  state: MembersState = {},
  action: Action
): MembersState {
  if (!action.$hope) return state

  switch (action.type) {

    case CONFIRMED_STATE:
      return action.members

    case JOIN_ROOM:
      if (!action.$hope.userId) return state
      if (state[action.$hope.userId]) return state                              // no need to be added twice
      return {...state, [action.$hope.userId]: {actionId: 0}}                   // add the userId to the collection

    case LEAVE_ROOM:
      if (!action.$hope.userId) return state
      const newState = {...state}
      delete newState[action.$hope.userId]
      return newState

    case PATCH:
      return patch(state, action.members)

    case CONFIRM_ACTION:
      if (!action.$hope.userId) return state
      const userId = action.$hope.userId
      const actionId = action.$hope.actionId
      const user = state[userId] || {}
      const updatedUser = {...user, actionId}
      return {...state, [userId]: updatedUser}

    default:
      return state
  }
}
