import {
  SET_ROOM_STATE,
  SET_ROOM_UPDATING,
  ADD_ROOM_MEMBER,
  REMOVE_ROOM_MEMBER
} from './room-actions'

export default function (state = {}, action = {}) {
  switch (action.type) {
    case undefined:
      return {
        memberIds: [],
        roomState: {},
        isUpdating: false
      }

    case SET_ROOM_STATE:
      return {
        ...state,
        roomState: action.roomState
      }

    case SET_ROOM_UPDATING:
      return {
        ...state,
        isUpdating: action.isUpdating
      }

    case ADD_ROOM_MEMBER:
      if (state.memberIds.indexOf(action.userId) !== -1) return state           // do nothing if the user is already a member of this room
      return {                                                                  // otherwise, add the userId to the memberIds list
        ...state,
        memberIds: [...state.memberIds, action.userId]
      }

    case REMOVE_ROOM_MEMBER:
      return {
        ...state,
        memberIds: state.memberIds.filter(userId => userId !== action.userId)
      }
  }
}
