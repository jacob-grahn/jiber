import {
  ROOM_BEGIN_UPDATE,
  ROOM_FINISH_UPDATE,
  ROOM_ADD_MEMBER,
  ROOM_REMOVE_MEMBER
} from './room-action-types'

interface RoomState {
  memberIds: Array<string>,                                                     // List of user ids that have joined this room
  roomState: any,                                                               // Last known copy of state from the db, this is sent to new members
  isUpdating: boolean,                                                          // Is this room in an update cycle
  updateStartedAt: number,                                                      // When the last update started
  stateTimeMs: number,                                                     // the time of the most recent action that affected the room state
  lastUpdateDuration: number,                                                   // How long the last update took
  updateCount: number                                                           // Total number of updates this room has performed
}

export default function (state: RoomState, action: any = {}): RoomState {
  switch (action.type) {
    case undefined:
      return {
        memberIds: [],
        roomState: {},
        isUpdating: false,
        updateStartedAt: 0,
        stateTimeMs: 0,
        lastUpdateDuration: 0,
        updateCount: 0
      }

    case ROOM_BEGIN_UPDATE:
      if (state.isUpdating) return state
      return {
        ...state,
        isUpdating: true,
        updateStartedAt: action.timeMs
      }

    case ROOM_FINISH_UPDATE:
      if (!state.isUpdating) return state
      return {
        ...state,
        roomState: action.roomState,
        isUpdating: false,
        stateTimeMs: action.stateTimeMs,
        lastUpdateDuration: action.stateTimeMs - state.updateStartedAt,
        updateCount: state.updateCount + 1
      }

    case ROOM_ADD_MEMBER:
      if (state.memberIds.indexOf(action.userId) !== -1) return state           // do nothing if the user is already a member of this room
      return {                                                                  // otherwise, add the userId to the memberIds list
        ...state,
        memberIds: [...state.memberIds, action.userId]
      }

    case ROOM_REMOVE_MEMBER:
      return {
        ...state,
        memberIds: state.memberIds.filter(userId => userId !== action.userId)
      }
  }
}
