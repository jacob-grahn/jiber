import { Action } from '../interfaces/action'

/**
 * Keep track of when the store was updated lastUpdatedAt
 */
export const lastUpdatedAt = (
  state: number = 0,
  action: Action
): number => {
  return action.$timeMs || state
}
