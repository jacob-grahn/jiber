import { Action } from '../../../core'
import {
  ROOM_BEGIN_UPDATE,
  ROOM_FINISH_UPDATE,
  ROOM_ADD_MEMBER,
  ROOM_REMOVE_MEMBER
} from './room-action-types'

export function roomBeginUpdate (roomId: string): Action {
  return {type: ROOM_BEGIN_UPDATE, timeMs: new Date().getTime(), id: roomId}
}

export function roomFinishUpdate (
  roomId: string,
  roomState: any,
  stateTimeMs: number
): Action {
  return {
    id: roomId,
    type: ROOM_FINISH_UPDATE,
    timeMs: new Date().getTime(),
    stateTimeMs
  }
}

export function roomAddMember (roomId: string, userId: string): Action {
  return {type: ROOM_ADD_MEMBER, id: roomId, userId}
}

export function roomRemoveMember (roomId: string , userId: string): Action {
  return {type: ROOM_REMOVE_MEMBER, id: roomId, userId}
}
