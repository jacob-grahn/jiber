import { SET_STATE, ADD_CONFIRMED_ACTION } from './optimistic-action-types'
import { Action } from '../../core'

export function setState (state: any): Action {
  return {type: SET_STATE, state}
}

export function addConfirmedAction (action: Action): Action {
  return {type: ADD_CONFIRMED_ACTION, action}
}
