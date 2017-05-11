import { HopeAction } from './room'

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 */
export default (
  actions: HopeAction[],
  userId: String,
  actionId: number
): HopeAction[] => {
  return actions.filter(action => {
    return (
      action && action.userId && action.actionId
      && (action.userId !== userId || action.actionId > actionId)
    )
  })
}
