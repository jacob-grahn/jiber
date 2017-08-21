import { withField } from './with-field'

export interface Options {
  members?: {[userId: string]: {actionId: number}},
  actions?: any[]
}

// Calculate what the next expected actionId for a user is
// This is useful for rejecting invalid optimistic actions
export const nextActionId = (
  userId: string,
  { members = {}, actions = [] }: Options = {}
): number => {
  const baseActionId = members[userId] ? members[userId].actionId : 0
  const optimisticCount = withField(actions, 'userId', userId).length
  return baseActionId + optimisticCount + 1
}
