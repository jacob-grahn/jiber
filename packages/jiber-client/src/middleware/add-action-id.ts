import { Action, Next } from 'jiber-core'

/**
 * Create an incrementing actionId
 */

let nextActionId = 1

export const addActionId = () => (next: Next) => (action: Action) => {
  if (!action.$actionId) {
    action.$actionId = nextActionId++
  }
  return next(action)
}
