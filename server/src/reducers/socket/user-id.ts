import { Action, ADD_USER } from '../../../core/index'

/**
 * The userId attached to this socket
 */
export const userId = (state: string = '', action: Action): string => {
  switch (action.type) {
    case ADD_USER:
      return action.user.userId
    default:
      return state
  }
}
