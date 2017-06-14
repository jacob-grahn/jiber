import { user, Action, LOGIN_RESULT, ADD_USER } from '../../core/index'

export default function me (state: any = undefined, action: Action): any {
  switch (action.type) {
    case LOGIN_RESULT:
      return user(state, {...action, type: ADD_USER})

    default:
      return state
  }
}
