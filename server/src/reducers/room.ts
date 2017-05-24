import { Action, Reducer, stateDictionary } from '../../../core/index'

// Setup
const keyName = 'roomId'
export interface RoomState {
  memberIds: Array<string>,                                                     // List of user ids that have joined this room
  roomState: any,                                                               // Last known copy of state from the db, this is sent to new members
  isUpdating: boolean,                                                          // Is this room in an update cycle
  updateStartedAt: number,                                                      // When the last update started
  stateTimeMs: number,                                                          // the time of the most recent action that affected the room state
  lastUpdateDuration: number,                                                   // How long the last update took
  updateCount: number                                                           // Total number of updates this room has performed
}

const defaultRoomState = {
  memberIds: [],
  roomState: {},
  isUpdating: false,
  updateStartedAt: 0,
  stateTimeMs: 0,
  lastUpdateDuration: 0,
  updateCount: 0
}

// Actions
const BEGIN_UPDATE = 'hope/room/BEGIN_UPDATE'
const FINISH_UPDATE = 'hope/room/FINISH_UPDATE'
const ADD_MEMBER = 'hope/room/ADD_MEMBER'
const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
const REMOVE = 'hope/room/REMOVE'

// Reducer
function roomReducer (
  state: RoomState = defaultRoomState,
  action: Action
): RoomState {
  switch (action.type) {
    case BEGIN_UPDATE:
      if (state.isUpdating) return state
      return {
        ...state,
        isUpdating: true,
        updateStartedAt: action.timeMs
      }

    case FINISH_UPDATE:
      if (!state.isUpdating) return state
      return {
        ...state,
        roomState: action.roomState,
        isUpdating: false,
        stateTimeMs: action.stateTimeMs,
        lastUpdateDuration: action.stateTimeMs - state.updateStartedAt,
        updateCount: state.updateCount + 1
      }

    case ADD_MEMBER:
      if (state.memberIds.indexOf(action.userId) !== -1) return state           // do nothing if the user is already a member of this room
      return {                                                                  // otherwise, add the userId to the memberIds list
        ...state,
        memberIds: [...state.memberIds, action.userId]
      }

    case REMOVE_MEMBER:
      return {
        ...state,
        memberIds: state.memberIds.filter(userId => userId !== action.userId)
      }

    default:
      return state
  }
}

export default stateDictionary(roomReducer, {keyName})

// Action Creators
export function beginUpdate (roomId: string): Action {
  return {type: BEGIN_UPDATE, timeMs: new Date().getTime(), id: roomId}
}

export function finishUpdate (
  roomId: string,
  roomState: any,
  stateTimeMs: number
): Action {
  return {
    id: roomId,
    type: FINISH_UPDATE,
    timeMs: new Date().getTime(),
    stateTimeMs
  }
}

export function addMember (roomId: string, userId: string): Action {
  return {type: ADD_MEMBER, roomId, userId}
}

export function removeMember (roomId: string , userId: string): Action {
  return {type: REMOVE_MEMBER, roomId, userId}
}

export function removeRoom (roomId: string): Action {
  return {type: REMOVE, roomId}
}
