import Action from '../interfaces/action'
import HopeAction from '../interfaces/hope-action'
import RoomState from '../interfaces/room-state'
import { SERVER } from '../constants/source-types'

// Actions
export const JOIN_ROOM = 'hope/room/JOIN_ROOM'
export const LEAVE_ROOM = 'hope/room/LEAVE_ROOM'
export const CONFIRMED_STATE = 'hope/room/CONFIRMED_STATE'
export const CONFIRMED_ACTION = 'hope/room/CONFIRMED_ACTION'

// Action Creators
export function confirmedState (
  roomId: string,
  result: RoomState
): HopeAction {
  const { confirmedState, actionIds, lastUpdatedAt } = result
  return {
    type: CONFIRMED_STATE,
    $hope: {roomId, source: SERVER, userId: '', timeMs: 0, actionId: 0},
    confirmedState,
    actionIds,
    lastUpdatedAt
  }
}

export function joinRoom (roomId: string): Action {
  return {type: JOIN_ROOM, $hope: {roomId}}
}

export function leaveRoom (roomId: string): Action {
  return {type: LEAVE_ROOM, $hope: {roomId}}
}
