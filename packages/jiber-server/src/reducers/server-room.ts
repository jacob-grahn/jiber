import {
  Action,
  Reducer,
  RoomState,
  CLOSE_ROOM,
  combineReducers,
  members,
  lastUpdatedAt,
  createConfirmed
} from 'jiber-core'

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
      case CLOSE_ROOM:
        return undefined

      default:
        return coreReducer(state, action)
    }
  }
}
