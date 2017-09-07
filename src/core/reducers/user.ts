import { Action } from '../interfaces/action'
import { User } from '../interfaces/user'
import { ADD_USER, REMOVE_USER } from '../constants/action-types'

/**
 * Keep track of the users that are connected to the server
 */
export const user = (
  state: User = {userId: ''},
  action: Action
): User => {
  switch (action.type) {
    case ADD_USER:
      return action.user

    case REMOVE_USER:
      return {userId: ''}

    default:
      return state
  }
}
