import { Action } from '../../../core/index'

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 */
export default (
  actions: Action[],
  userId: String,
  actionId: number
): Action[] => {
  return actions.filter(action => {
    return (action.userId !== userId || action.actionId > actionId)
  })
}
