import {
  Action,
  Reducer,
  RoomState,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  combineReducers,
  members,
  lastUpdatedAt,
  confirmed
} from '../../../core/index'

export default function createServerRoom (subReducer: Reducer): Reducer {
  const serverRoom = combineReducers({
    members,
    confirmed: confirmed(subReducer),
    lastUpdatedAt
  })

  return function (state: RoomState, action: Action): RoomState {
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
        const members = state.confirmed.members
        const _private = state.confirmed.private
        const confirmed = {
          ...state.confirmed,
          $private: undefined,
          $members: undefined
        }
        return {...state, confirmed, private: _private, members}
      }

      default:
        return serverRoom(state, action)
    }
  }
}
