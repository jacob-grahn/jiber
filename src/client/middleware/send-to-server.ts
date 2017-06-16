import { Action, Middleware, CLIENT, LOGIN_RESULT, get } from '../../core/index'
import { ServerConnection } from '../server-connection'

export default function createSendToServer (
  server: ServerConnection
): Middleware {
  return () => (next: Function) => (action: Action) => {
    if (!action.$hope) return next(action)                                      // ignore actions without metadata
    if (action.$hope.source === CLIENT) {
      const roomId = get(action, '$hope.roomId') || action.$hope
      const smallerAction = {...action, $hope: roomId}
      server.send(smallerAction)
    }
    if (action.type === LOGIN_RESULT) {
      server.sendQueue()
    }
    next(action)
  }
}
