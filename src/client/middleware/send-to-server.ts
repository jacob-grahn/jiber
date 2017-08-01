import { Action, Middleware, CLIENT } from '../../core/index'

export default function sendToServer (
  send: (action: Action) => void
): Middleware {
  return () => (next: Function) => (action: Action) => {
    if (action.$source === CLIENT) send(action)
    next(action)
  }
}
