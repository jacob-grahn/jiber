import { Action, ADD_USER } from '../../../core/index'

export default function userId (
  state: string = '',
  action: Action
): string {
  switch (action.type) {
    case ADD_USER:
      return action.user.userId

    default:
      return state
  }
}
