import { Action } from '../../../core/index'

/**
 * Assign a userId to actions that don't have a userId
 */
export default function claimActions (
  actions: Action[],
  userId: string
): Action[] {
  return actions.map(action => action.userId ? action : {...action, userId})
}
