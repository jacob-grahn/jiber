import { Action, HopeAction, SERVER } from '../../core/index'

// Actions
export const ADD_MEMBER = 'hope/room/ADD_MEMBER'
export const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
export const JOIN_ROOM = 'hope/room/JOIN_ROOM'
export const LEAVE_ROOM = 'hope/room/LEAVE_ROOM'
export const CONFIRMED_STATE = 'hope/room/CONFIRMED_STATE'
export const CONFIRMED_ACTION = 'hope/room/CONFIRMED_ACTION'

// Action Creators
export interface CoreRoomState {
  confirmedState: any,
  actionIds: {[key: string]: number}
}
export function confirmedState (
  roomId: string,
  result: CoreRoomState
): HopeAction {
  const { confirmedState, actionIds } = result
  return {
    type: CONFIRMED_STATE,
    $hope: {roomId, source: SERVER, userId: '', timeMs: 0, actionId: 0},
    confirmedState,
    actionIds
  }
}

export function addMember (roomId: string, userId: string): Action {
  return {type: ADD_MEMBER, $hope: roomId, userId}
}

export function removeMember (roomId: string , userId: string): Action {
  return {type: REMOVE_MEMBER, $hope: roomId, userId}
}

export function joinRoom (roomId: string): Action {
  return {type: JOIN_ROOM, $hope: roomId}
}

export function leaveRoom (roomId: string): Action {
  return {type: LEAVE_ROOM, $hope: roomId}
}
