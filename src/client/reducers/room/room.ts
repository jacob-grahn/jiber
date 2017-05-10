import { Action, Reducer } from '../../../core/index'
import claimActions from './claim-actions'
import pruneActions from './prune-actions'
import nextActionId from './next-action-id'

// Setup
const NOT_JOINING = 'NOT_JOINING'
const JOINING = 'JOINING'
const JOINED = 'JOINED'

export interface RoomState {
  memberIds: Array<string>,                                                     // List of user ids that have joined this room
  confirmed: any,
  optimistic: any,
  actions: Array<Action>,
  actionIds: {[key: string]: number},                                           // number of actions sent by userId
  myUserId: string,
  status: string
}
const defaultState: RoomState = {
  memberIds: [],
  confirmed: undefined,
  optimistic: undefined,
  actions: [],
  actionIds: {},
  myUserId: undefined,
  status: NOT_JOINING
}

// Actions
const ADD_MEMBER = 'hope/room/ADD_MEMBER'
const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
const JOIN = 'hope/room/JOIN'
const LEAVE = 'hope/room/LEAVE'
const JOIN_RESULT = 'hope/room/JOIN_RESULT'
const CONFIRM_ACTION = 'hope/room/CONFIRM_ACTION'

// Reducer
export default function reducerEnhancer (reducer: Reducer): Reducer {
  return function roomReducer (
    state: RoomState = defaultState,
    action: Action = {}
  ): RoomState {
    switch (action.type) {
      case undefined:
        return state

      case JOIN_RESULT:
        const claimedActions = claimActions(state.actions, action.myUserId)
        return {
          ...state,
          actions: claimedActions,
          confirmed: action.confirmedState,
          optimistic: claimedActions.reduce(reducer, action.confirmedState),
          myUserId: action.myUserId,
          actionIds: action.actionIds,
          memberIds: action.memberIds,
          status: JOINED
        }

      case CONFIRM_ACTION:
        const cAction = action.action
        const confirmedState = reducer(state.confirmed, cAction)
        const actions = pruneActions(
          state.actions,
          cAction.userId,
          cAction.actionId
        )
        return {
          ...state,
          actions,
          confirmed: confirmedState,
          optimistic: actions.reduce(reducer, confirmedState),
          actionIds: {
            ...state.actionIds,
            [cAction.userId]: cAction.actionId
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
          memberIds: state.memberIds.filter(userId => userId !== action.userId),
          actionIds: {...state.actionIds, [action.userId]: undefined}
        }

      case JOIN:
        return {
          ...defaultState,
          status: JOINING
        }

      case LEAVE:
        return undefined

      default:
        return {
          ...state,
          actions: [
            ...state.actions,
            {
              ...action,
              userId: state.myUserId,
              actionId: nextActionId(state, state.myUserId)
            }
          ],
          confirmed: state.confirmed,
          optimistic: reducer(state.optimistic, action)
        }
    }
  }
}

// Action Creators
export function joinResult (
  hopeRoomId: string,
  confirmedState: any,
  myUserId: string,
  actionIds: {[key: string]: number},
  memberIds: string[]
): Action {
  return {
    type: JOIN_RESULT,
    hopeRoomId,
    confirmedState,
    myUserId,
    actionIds,
    memberIds
  }
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

export function join (hopeRoomId: string): Action {
  return {type: JOIN, hopeRoomId}
}

export function leave (hopeRoomId: string): Action {
  return {type: LEAVE, hopeRoomId}
}
