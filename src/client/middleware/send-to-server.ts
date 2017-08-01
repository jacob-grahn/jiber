import { Action, Middleware } from '../../core/index'

export default function sendToServer (
  send: (action: Action) => void
): Middleware {
  return () => (next: Function) => (action: Action) => {
    if (!action.$roomId) return next(action)                                    // ignore actions without metadata
    if (action.$actionId) return next(action)                                   // this action came from a peer or the server
    send(action)
    next(action)
  }
}
