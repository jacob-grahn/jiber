import { Action, User, LOGIN_RESULT } from 'jiber-core'

/**
 * Keep track of the currently logged in userId
 * todo: maybe reuse the user reducer
 */
export const me = (
  state: User = {userId: ''},
  action: Action
): User => {
  switch (action.type) {
    case LOGIN_RESULT:
      return action.user

    default:
      return state
  }
}
