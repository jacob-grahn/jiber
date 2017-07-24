import { Action, Middleware } from '../../core/index'
import { ServerConnection } from '../server-connection'

export default function createSendToServer (
  server: ServerConnection
): Middleware {
  return () => (next: Function) => (action: Action) => {
    if (!action.$hope) return next(action)                                      // ignore actions without metadata
    if (!action.$hope.actionId) {
      server.send(action)
    }
    next(action)
  }
}
