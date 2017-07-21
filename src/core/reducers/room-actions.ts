import Action from '../interfaces/action'
import RoomState from '../interfaces/room-state'
import { SERVER } from '../constants/source-types'

// Actions
export const JOIN_ROOM = 'hope/room/JOIN_ROOM'
export const LEAVE_ROOM = 'hope/room/LEAVE_ROOM'
export const CONFIRMED_STATE = 'hope/room/CONFIRMED_STATE'
export const DIFF = 'hope/room/DIFF'

// Action Creators
export function confirmedStateAction (
  roomId: string,
  result: RoomState
): Action {
  const { confirmed, members, lastUpdatedAt } = result
  return {
    type: CONFIRMED_STATE,
    $hope: {roomId, source: SERVER},
    confirmed,
    members,
    lastUpdatedAt
  }
}

export function joinRoom (roomId: string): Action {
  return {type: JOIN_ROOM, $hope: {roomId}}
}

export function leaveRoom (roomId: string): Action {
  return {type: LEAVE_ROOM, $hope: {roomId}}
}
