import { Action, Next } from 'jiber-core'

/**
 * @hidden
 */
let nextActionId = 1

/**
 * Create an incrementing actionId
 * @hidden
 */
export const addActionId = () => (next: Next) => (action: Action) => {
  if (!action.$actionId) {
    action.$actionId = nextActionId++
  }
  return next(action)
}
