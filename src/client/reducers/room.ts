import { Action, Reducer } from '../../core/index'

// Setup
const NOT_JOINING = 'NOT_JOINING'
const JOINING = 'JOINING'
const JOINED = 'JOINED'

interface RoomState {
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
export default function reducerEnhancer (reducer: Function): Reducer {
  return function roomReducer (
    state: RoomState = defaultState,
    action: Action = {}
  ): RoomState {
    switch (action.type) {
      case undefined:
        return state

      case JOIN_RESULT:
        return {
          ...state,
          actions: claimActions(state.actions, action.myUserId),
          confirmed: action.confirmed,
          optimistic: applyActions(reducer, action.confirmed, state.actions),
          myUserId: action.myUserId,
          actionIds: action.actionIds,
          memberIds: action.memeberids,
          status: JOINED
        }

      case CONFIRM_ACTION:
        const cAction = action.action
        const confirmedState = reducer(state.confirmed, cAction)
        const actions = removeOldActions(
          state.actions,
          cAction.userId,
          cAction.actionId
        )
        return {
          ...state,
          actions,
          confirmed: confirmedState,
          optimistic: applyActions(reducer, confirmedState, actions),
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

function removeOldActions (
  actions: Array<Action>,
  userId: String,
  actionId: number
) {
  return actions.filter(action => {
    return (action.userId !== userId || action.actionId > actionId)
  })
}

/**
 * Applies a list of actions to a state
 */
function applyActions (
  reducer: Function,
  state: RoomState,
  actions: Array<Action>
): RoomState {
  return actions.reduce((state, action): RoomState => {
    return reducer(state, action)
  }, state)
}

/**
 * Claim optimistic actions without a userId as your own
 */
function claimActions (
  actions: Array<Action>,
  myUserId: string
): Array<Action> {
  return actions.map(action => {
    if (action.userId) return action
    return {...action, userId: myUserId}
  })
}

/**
 * Calculate what the next expected actionId for a user is
 * This is useful for rejecting invalid optimistic actions
 */
function nextActionId (state: RoomState, userId: string): number {
  const baseActionId = state.actionIds[userId] || 0
  const optimisticCount = matchUserId(state.actions, userId).length
  return baseActionId + optimisticCount + 1
}

/**
 * Return actions that have a specefied userId
 */
function matchUserId (actions: Array<Action>, userId: string): Array<Action> {
  return actions.filter(action => {
    return action.userId === userId
  })
}

// Action Creators
export function joinResult (
  hopeRoomId: string,
  state: any,
  myUserId: string,
  actionIds: {[key: string]: number},
  memberIds: string[]
): Action {
  return {type: JOIN_RESULT, hopeRoomId, state, myUserId, actionIds, memberIds}
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
