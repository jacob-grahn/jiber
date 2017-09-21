import { Action, Next } from 'jiber-core'

/**
 * Mostly this middleware exists to create an incrementing actionId
 * for local actions.
 * userId and timeMs are also added to create some consistency between
 * optimistic and confirmed actions
 */

let nextActionId = 1

export const addActionId = () => (next: Next) => (action: Action) => {
  if (!action.$actionId) {
    action.$actionId = nextActionId++
  }
  return next(action)
}
