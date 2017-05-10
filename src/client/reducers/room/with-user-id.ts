import { Action } from '../../../core/index'

/**
 * Return actions that have a specefied userId
 */
export default function withUserId (
  actions: Action[],
  userId: string
): Action[] {
  return actions.filter(action => action.userId === userId)
}
