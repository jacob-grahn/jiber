import {
  Action,
  Reducer,
  RoomState,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  CLOSE_ROOM,
  combineReducers,
  members,
  lastUpdatedAt,
  createConfirmed
} from '../core'

/**
 * A server room stores confirmedState, who is a member, and when
 * the last update was
 */
export const createServerRoom = (subReducer: Reducer): Reducer => {
  const confirmed = createConfirmed(subReducer)
  const coreReducer = combineReducers({
    members,
    confirmed,
    lastUpdatedAt
  })

  return (state: RoomState, action: Action): RoomState|undefined => {
    switch (action.type) {

      case INJECT_PRIVATE: {
        const confirmed = {
          ...state.confirmed,
          $private: state.private,
          $members: state.members
        }
        return {...state, confirmed}
      }

      case CLEAN_PRIVATE: {
        const members = state.confirmed.$members
        const _private = state.confirmed.$private                               // private is a reserved keyword, oops
        const confirmed = {...state.confirmed}
        delete confirmed.$private
        delete confirmed.$members
        return {...state, confirmed, private: _private, members}
      }

      case CLOSE_ROOM:
        return undefined

      default:
        return coreReducer(state, action)
    }
  }
}
