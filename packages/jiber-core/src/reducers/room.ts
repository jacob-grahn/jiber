import { Action } from '../interfaces/action'
import { Reducer } from '../interfaces/reducer'
import { UserDict } from '../interfaces/user-dict'
import { CLOSE_ROOM } from '../constants/action-types'
import { combineReducers } from './combine-reducers'
import { members } from './members'
import { lastUpdatedAt } from './last-updated-at'
import { createConfirmed } from './confirmed'

export interface RoomState {
  private?: any,
  confirmed: any,
  members: UserDict,
  lastUpdatedAt: number
}

/**
 * A room stores confirmedState, who is a member, and when
 * the last update was
 */
export const createRoom = (subReducer: Reducer): Reducer => {
  const coreReducer = combineReducers({
    members,
    lastUpdatedAt,
    confirmed: createConfirmed(subReducer)
  })

  return (state: RoomState, action: Action): RoomState|undefined => {
    switch (action.type) {
      case CLOSE_ROOM:
        return undefined

      default:
        return coreReducer(state, action)
    }
  }
}
