import { Action, Next } from 'jiber-core'

/**
 * Create an incrementing actionId
 */

let nextActionId = 1

export const addActionId = () => (next: Next) => (action: Action) => {
  if (!action.$id) {
    action.$id = nextActionId++
  }
  return next(action)
}
