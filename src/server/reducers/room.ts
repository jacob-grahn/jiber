import { Action, Reducer, stateDictionary } from '../../core/index'

// Setup
const keyName = 'roomId'
export interface InternalRoomState {
  actionIds: {[userId: string]: number},
  confirmedState: any,
  lastUpdateMs: number,
}
export interface MetaRoomState {
  roomState: InternalRoomState,                                                 // Last known copy of state from the db, this is sent to new members
  isUpdating: boolean,                                                          // Is this room in an update cycle
  updateStartedAt: number,                                                      // When the last update started
  stateTimeMs: number,                                                          // the time of the most recent action that affected the room state
  lastUpdateDuration: number,                                                   // How long the last update took
  updateCount: number                                                           // Total number of updates this room has performed
}

const defaultRoomState = {
  roomState: {
    actionIds: {},
    confirmedState: undefined,
    lastUpdateMs: 0
  },
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
  state: MetaRoomState = defaultRoomState,
  action: Action
): MetaRoomState {
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
      if (state.roomState.actionIds[action.userId]) return state                // do nothing if the user is already a member of this room
      return {                                                                  // otherwise, add the userId to the actionId collection
        ...state,
        roomState: {
          ...state.roomState,
          actionIds: {...state.roomState.actionIds, [action.userId]: 0}
        }
      }

    case REMOVE_MEMBER:
      const roomState = state.roomState
      const actionIds = {...roomState.actionIds, [action.userId]: undefined}
      return {
        ...state,
        roomState: {
          ...state.roomState,
          actionIds
        }
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
