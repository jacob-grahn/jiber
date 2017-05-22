import { Action, SERVER } from '../../core/index'
import HopeAction from '../interfaces/hope-action'

// Actions
export const ADD_MEMBER = 'hope/room/ADD_MEMBER'
export const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
export const JOIN = 'hope/room/JOIN'
export const LEAVE = 'hope/room/LEAVE'
export const JOIN_RESULT = 'hope/room/JOIN_RESULT'

// Action Creators
interface JoinResult {
  confirmedState: any,
  myUserId: string,
  actionIds: {[key: string]: number},
  memberIds: string[]
}
export function joinResult (roomId: string, result: JoinResult): HopeAction {
  const { confirmedState, myUserId, actionIds, memberIds } = result
  return {
    type: JOIN_RESULT,
    $hope: {roomId, userId: myUserId, source: SERVER, actionId: 0},
    confirmedState,
    myUserId,
    actionIds,
    memberIds
  }
}

export function addMember (roomId: string, userId: string): Action {
  return {type: ADD_MEMBER, $hope: roomId, userId}
}

export function removeMember (roomId: string , userId: string): Action {
  return {type: REMOVE_MEMBER, $hope: roomId, userId}
}

export function join (roomId: string): Action {
  return {type: JOIN, $hope: roomId}
}

export function leave (roomId: string): Action {
  return {type: LEAVE, $hope: roomId}
}

// Misc
export function isRoomAction (type: string): boolean {
  return type.indexOf('hope/room/') === 0
}
