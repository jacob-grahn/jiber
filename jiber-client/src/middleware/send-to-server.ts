import { Action, Next, CLIENT } from 'jiber-core'

/**
 * Send locally dispatched actions to the server for confirmation
 */
export const createSendToServer = (
  send: (action: Action) => void
) => {
  return () => (next: Next) => (action: Action) => {
    if (action.$source === CLIENT) send(action)
    next(action)
  }
}
