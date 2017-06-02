import { Action, stateDictionary, combineReducers } from '../../../core/index'
import actionIds from './action-ids'
import confirmedState from './confirmed-state'
import isUpdating from './is-updating'

// Actions
export const BEGIN_UPDATE = 'hope/room/BEGIN_UPDATE'
export const FINISH_UPDATE = 'hope/room/FINISH_UPDATE'
export const ADD_MEMBER = 'hope/room/ADD_MEMBER'
export const REMOVE_MEMBER = 'hope/room/REMOVE_MEMBER'
export const REMOVE = 'hope/room/REMOVE'

// Reducer
const keyName = 'roomId'
const roomReducer = combineReducers({
  actionIds,
  confirmedState,
  isUpdating
})
export default stateDictionary(roomReducer, {keyName})

// Action Creators
export function beginUpdate (roomId: string): Action {
  return {type: BEGIN_UPDATE, roomId}
}

export function finishUpdate (roomId: string, confirmedState: any): Action {
  return {type: FINISH_UPDATE, roomId, confirmedState}
}

export function addMember (roomId: string, userId: string): Action {
  return {type: ADD_MEMBER, roomId, userId}
}

export function removeMember (roomId: string , userId: string): Action {
  return {type: REMOVE_MEMBER, roomId, userId}
}

export function removeRoom (roomId: string): Action {
  return {type: REMOVE, roomId}
}
