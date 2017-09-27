import { Action, Next } from 'jiber-core'

/**
 * Send locally dispatched actions to the server for confirmation
 */
export const createSendToServer = (
  send: (action: Action) => void
) => {
  return () => (next: Next) => (action: Action) => {
    if (!action.$confirmed) send(action)
    next(action)
  }
}
