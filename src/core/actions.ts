import { SET_STATE, ADD_CONFIRMED_ACTION } from './constants/action-types'
import { IAction } from './i-action'

export function setState (state: any) {
  return {type: SET_STATE, state}
}

export function addConfirmedAction (action: IAction) {
  return {type: ADD_CONFIRMED_ACTION, action}
}
