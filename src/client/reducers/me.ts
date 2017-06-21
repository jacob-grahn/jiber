import { user, Action, UserState, LOGIN_RESULT, ADD_USER } from '../../core/index'

export default function me (
  state: UserState = {userId: ''},
  action: Action
): UserState {
  switch (action.type) {
    case LOGIN_RESULT:
      return user(state, {...action, type: ADD_USER})

    default:
      return state
  }
}
