import { Action, Next, CLIENT } from '../../core/index'

export const createSendToServer = (
  send: (action: Action) => void
) => {
  return () => (next: Next) => (action: Action) => {
    if (action.$source === CLIENT) send(action)
    next(action)
  }
}
