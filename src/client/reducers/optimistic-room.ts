import { Action, Reducer } from '../../core/index'

// Setup
const keyName = 'hopeRoomId'
const namespace = ''
interface OptimisticState {
  memberIds: Array<string>,                                                     // List of user ids that have joined this room
  confirmed: any,
  optimistic: any,
  actions: Array<Action>
}

// Actions
const ADD_MEMBER = 'hope/room/ADD_MEMBER'
const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
const REMOVE = 'hope/room/REMOVE'
const SET_STATE = 'hope/room/SET_STATE'
const ADD_CONFIRMED_ACTION = 'hope/room/ADD_CONFIRMED_ACTION'
const REMOVE_OPTIMISTIC_ACTION = 'hope/room/REMOVE_OPTIMISTIC_ACTION'

// Reducer
export default function reducer (reducer: Function): Reducer {
  return (state: OptimisticState, action: Action = {}): OptimisticState => {
    switch (action.type) {
      case undefined:
        return {
          memberIds: [],
          confirmed: reducer(),
          optimistic: reducer(),
          actions: []
        }

      case SET_STATE:
        return {
          ...state,
          confirmed: action.confirmed,
          optimistic: applyActions(reducer, action.confirmed, state.actions),
          actions: state.actions
        }

      case ADD_CONFIRMED_ACTION:
        return {
          ...state,
          confirmed: reducer(state.confirmed, action.confirmedAction),
          optimistic: applyActions(reducer, state.confirmed, state.actions),
          actions: removeById(state.actions, action.id)
        }

      case ADD_MEMBER:
        if (state.memberIds.indexOf(action.userId) !== -1) return state         // do nothing if the user is already a member of this room
        return {                                                                // otherwise, add the userId to the memberIds list
          ...state,
          memberIds: [...state.memberIds, action.userId]
        }

      case REMOVE_MEMBER:
        return {
          ...state,
          memberIds: state.memberIds.filter(userId => userId !== action.userId)
        }

      case REMOVE:
        return undefined

      default:
        return {
          ...state,
          confirmed: state.confirmed,
          optimistic: reducer(state.optimistic, action),
          actions: [...state.actions, action]
        }
    }
  }
}

/**
 * Filters out actions with _timeMs less than minTimeMs
 */
function removeById (actions: Array<Action>, id: String) {
  return actions.filter(action => {
    return action.quantumId !== id
  })
}

/**
 * Applies a list of actions to a state
 */
function applyActions (
  reducer: Function,
  state: OptimisticState,
  actions: Array<Action>
): OptimisticState {
  return actions.reduce((state, action): OptimisticState => {
    return reducer(state, action)
  }, state)
}

// Action Creators
export function setState (hopeRoomId: string, state: any): Action {
  return {type: SET_STATE, hopeRoomId, state}
}

export function addConfirmedAction (hopeRoomId: string, action: Action): Action {
  return {type: ADD_CONFIRMED_ACTION, hopeRoomId, action}
}

export function addMember (hopeRoomId: string, userId: string): Action {
  return {type: ADD_MEMBER, hopeRoomId, userId}
}

export function removeMember (hopeRoomId: string , userId: string): Action {
  return {type: REMOVE_MEMBER, hopeRoomId, userId}
}

export function removeRoom (hopeRoomId: string): Action {
  return {type: REMOVE, hopeRoomId}
}
