import { Action, Next, SERVER } from 'jiber-core'

/**
 * Send locally dispatched actions to the server for confirmation
 */
export const createSendToServer = (
  send: (action: Action) => void
) => {
  return () => (next: Next) => (action: Action) => {
    if (action.$source !== SERVER) send(action)
    next(action)
  }
}
