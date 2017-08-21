import Action from '../interfaces/action'
import UserState from '../interfaces/user-state'
import { ADD_USER, REMOVE_USER } from '../constants/action-types'

// Reducer
export const user = (
  state: UserState = {userId: ''},
  action: Action
): UserState => {
  switch (action.type) {
    case ADD_USER:
      return action.user

    case REMOVE_USER:
      return {userId: ''}

    default:
      return state
  }
}
