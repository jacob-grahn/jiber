import withUserId from './with-user-id'

/**
 * Calculate what the next expected actionId for a user is
 * This is useful for rejecting invalid optimistic actions
 */
export default function nextActionId (
  state: {actionIds: {[key: string]: number}, actions: any[]},
  userId: string
): number {
  const baseActionId = state.actionIds[userId] || 0
  const optimisticCount = withUserId(state.actions, userId).length
  return baseActionId + optimisticCount + 1
}
