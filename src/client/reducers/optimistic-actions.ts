import { SET_STATE, ADD_CONFIRMED_ACTION } from './optimistic-action-types'
import { IAction } from '../../core/i-action'

export function setState (state: any): IAction {
  return {type: SET_STATE, state}
}

export function addConfirmedAction (action: IAction): IAction {
  return {type: ADD_CONFIRMED_ACTION, action}
}
