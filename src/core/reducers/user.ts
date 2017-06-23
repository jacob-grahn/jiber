import Action from '../interfaces/action'
import UserState from '../interfaces/user-state'

// Actions
export const ADD_USER = 'hope/user/ADD_USER'
export const REMOVE_USER = 'hope/user/REMOVE_USER'
export const LOGIN_RESULT = 'hope/user/LOGIN_RESULT'

// Reducer
export default function user (
  state: UserState = {userId: ''},
  action: Action
): UserState {
  switch (action.type) {
    case ADD_USER:
      return action.user

    case REMOVE_USER:
      return {userId: ''}

    default:
      return state
  }
}

// Action Creators
export function addUser (user: UserState): Action {
  return {type: ADD_USER, user}
}

export function removeUser (userId: string): Action {
  return {type: REMOVE_USER, user: {userId}}
}

export function loginResult (user: UserState): Action {
  return {type: LOGIN_RESULT, user}
}
