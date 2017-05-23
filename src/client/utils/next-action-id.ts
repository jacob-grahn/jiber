import withField from './with-field'

interface Options {
  actionIds?: {[key: string]: number},
  actions?: any[]
}

// Calculate what the next expected actionId for a user is
// This is useful for rejecting invalid optimistic actions
export default function nextActionId (
  userId: string,
  { actionIds = {}, actions = [] }: Options
): number {
  const baseActionId = actionIds[userId] || 0
  const optimisticCount = withField(actions, 'userId', userId).length
  return baseActionId + optimisticCount + 1
}
