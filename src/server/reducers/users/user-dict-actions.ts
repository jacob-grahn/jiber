import { USER_REMOVE } from './user-dict-action-types'
import { IAction } from '../../../core/i-action'

export function userRemove (userId: String): IAction {
  return { type: USER_REMOVE, id: userId }
}
