import { Action, Reducer } from '../../core/index'

// Setup
interface OptimisticState {
  memberIds: Array<string>,                                                     // List of user ids that have joined this room
  confirmed: any,
  optimistic: any,
  actions: Array<Action>,
  actionCounts: {[key: string]: number}                                         // number of actions sent by userId
}
const defaultState: OptimisticState = {
  memberIds: [],
  confirmed: undefined,
  optimistic: undefined,
  actions: [],
  actionCounts: {}
}

// Actions
const ADD_MEMBER = 'hope/room/ADD_MEMBER'
const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
const REMOVE = 'hope/room/REMOVE'
const SET_STATE = 'hope/room/SET_STATE'
const CONFIRM_ACTION = 'hope/room/CONFIRM_ACTION'

// Reducer
export default function reducerEnhancer (reducer: Function): Reducer {
  return function roomReducer (
    state: OptimisticState = defaultState,
    action: Action = {}
  ): OptimisticState {
    switch (action.type) {
      case undefined:
        return state

      case SET_STATE:
        return {
          ...state,
          actions: state.actions,
          confirmed: action.confirmed,
          optimistic: applyActions(reducer, action.confirmed, state.actions)
        }

      case CONFIRM_ACTION:
        const cAction = action.action
        const confirmedState = reducer(state.confirmed, cAction)
        const actions = filterActions(
          state.actions,
          cAction.userId,
          cAction.actionCount
        )
        return {
          ...state,
          actions,
          confirmed: confirmedState,
          optimistic: applyActions(reducer, confirmedState, actions),
          actionCounts: {
            ...state.actionCounts,
            [cAction.userId]: cAction.actionCount
          }
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
          actions: [...state.actions, action],
          confirmed: state.confirmed,
          optimistic: reducer(state.optimistic, action)
        }
    }
  }
}

function filterActions (
  actions: Array<Action>,
  userId: String,
  actionCount: number
) {
  return actions.filter(action => {
    return (action.userId !== userId || action.actionCount > actionCount)
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

export function confirmAction (hopeRoomId: string, action: Action): Action {
  return {type: CONFIRM_ACTION, hopeRoomId, action}
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
