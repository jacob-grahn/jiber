import { Action } from '../interfaces/action'
import {
  JOIN_ROOM,
  LEAVE_ROOM,
  CONFIRMED_STATE,
  PATCH
} from '../constants/action-types'
import { SERVER } from '../constants/source-types'
import { patch } from '../utils/patch'
import { createDictionary } from './dictionary'

export interface MembersState {
  [userId: string]: {actionId: number}
}

const member = (
  state: {actionId: number}|undefined = undefined,
  action: Action
) => {
  switch (action.type) {
    case JOIN_ROOM:
      if (state) return state                                                   // no need to be added twice
      return {actionId: 0}                                                      // add the userId to the collection

    case LEAVE_ROOM:
      return undefined

    default:
      if (action.$source === SERVER && action.$actionId) {
        return {...state, actionId: action.$actionId}
      }
      return state
  }
}

const memberDict = createDictionary(member, '$userId')

export const members = (
  state: MembersState = {},
  action: Action
): MembersState => {
  switch (action.type) {
    case CONFIRMED_STATE:
      return action.members

    case PATCH:
      return patch(state, action.members)

    default:
      return memberDict(state, action)
  }
}
