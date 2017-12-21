import { Action, User, LOGIN_RESULT } from 'jiber-core'

// todo: what is going on with this '$timeMsemp' value?

/**
 * Keep track of the currently logged in user
 * @hidden
 */
export const me = (state: User = { userId: '$timeMsemp' }, action: Action): User => {
  switch (action.type) {
    case LOGIN_RESULT:
      return action.user

    default:
      return state
  }
}
