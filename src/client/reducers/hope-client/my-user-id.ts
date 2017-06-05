import { Action } from '../../../core/index'
import { LOGIN_RESULT } from './hope-actions'

export default function myUserId (state: string = '', action: Action): string {
  switch (action.type) {
    case LOGIN_RESULT:
      return action.result.myUserId

    default:
      return state
  }
}
