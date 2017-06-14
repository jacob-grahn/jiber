import { Action } from '../interfaces/action'

// Actions
export const LOGIN_REQUEST = 'hope/user/LOGIN_REQUEST'
export const LOGIN_RESULT = 'hope/user/LOGIN_RESULT'
export const ADD_USER = 'hope/user/ADD_USER'
export const REMOVE_USER = 'hope/user/REMOVE_USER'

export interface UserState {
  userId: string,
  [key: string]: any
}

// Reducer
export default function user (
  state: UserState = {userId: ''},
  action: Action
): UserState {
  switch (action.type) {
    case ADD_USER:
      return action.user

    default:
      return state
  }
}

// Action Creators
export function loginRequest (credential: any): Action {
  return {type: LOGIN_REQUEST, credential}
}

export function loginResult (user: UserState): Action {
  return {type: LOGIN_RESULT, user}
}

export function addUser (user: UserState): Action {
  return {type: ADD_USER, user}
}

export function removeUser (userId: string): Action {
  return {type: REMOVE_USER, user: {userId}}
}
