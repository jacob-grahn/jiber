// TODO: should this be a dict?

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
  switch (action.type) {

    case CONFIRMED_STATE:
      return action.members

    case JOIN_ROOM:
      if (!action.$userId) return state
      if (state[action.$userId]) return state                                   // no need to be added twice
      return {...state, [action.$userId]: {actionId: 0}}                        // add the userId to the collection

    case LEAVE_ROOM:
      if (!action.$userId) return state
      const newState = {...state}
      delete newState[action.$userId]
      return newState

    case PATCH:
      return patch(state, action.members)

    case CONFIRM_ACTION:
      if (!action.$userId) return state
      const userId = action.$userId
      const actionId = action.$actionId
      const user = state[userId] || {}
      const updatedUser = {...user, actionId}
      return {...state, [userId]: updatedUser}

    default:
      return state
  }
}
