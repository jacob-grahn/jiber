import { Action, UserState, LOGIN_RESULT } from '../../core/index'

/**
 * Keep track of the currently logged in userId
 * todo: maybe reuse the user reducer
 */
export const me = (
  state: UserState = {userId: ''},
  action: Action
): UserState => {
  switch (action.type) {
    case LOGIN_RESULT:
      return action.user

    default:
      return state
  }
}
