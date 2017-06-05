// Actions
export const LOGIN = 'hope/LOGIN'
export const LOGIN_RESULT = 'hope/LOGIN_RESULT'

// Action Creators
export function login (credential: any) {
  return {type: LOGIN, credential}
}

export function loginResult (result: any) {
  return {type: LOGIN_RESULT, result}
}
