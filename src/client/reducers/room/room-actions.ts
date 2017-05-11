import { Action } from '../../../core/index'

// Actions
export const ADD_MEMBER = 'hope/room/ADD_MEMBER'
export const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
export const JOIN = 'hope/room/JOIN'
export const LEAVE = 'hope/room/LEAVE'
export const JOIN_RESULT = 'hope/room/JOIN_RESULT'
export const SERVER_ACTION = 'hope/room/SERVER_ACTION'
export const PEER_ACTION = 'hope/room/PEER_ACTION'
export const CLIENT_ACTION = 'hope/room/CLIENT_ACTION'

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

export function serverAction ($hope: string, action: Action): Action {
  return {type: SERVER_ACTION, $hope, action}
}

export function peerAction ($hope: string, action: Action): Action {
  return {type: PEER_ACTION, $hope, action}
}

export function clientAction($hope: string, action: Action): Action {
  /*$hope: {
    roomId: action.$hope as string,
    userId: state.myUserId,
    actionId: nextActionId(state.myUserId, state),
    source: CLIENT
  } */
  return {type: CLIENT_ACTION, $hope, action}
}

export function addMember ($hope: string, userId: string): Action {
  return {type: ADD_MEMBER, $hope, userId}
}

export function removeMember ($hope: string , userId: string): Action {
  return {type: REMOVE_MEMBER, $hope, userId}
}

export function join ($hope: string): Action {
  return {type: JOIN, $hope}
}

export function leave ($hope: string): Action {
  return {type: LEAVE, $hope}
}
