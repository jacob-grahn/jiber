import { Store, LOGIN_REQUEST } from '../../core/index'
import { socketReceive } from '../reducers/socket'
import { ServerSettings } from '../interfaces/server-settings'

export default function createOnMessage (
  store: Store,
  settings: ServerSettings,
  onLogin: Function,
  onAction: Function
) {
  return async function onMessage (
    socketId: string,
    message: string
  ): Promise<void> {
    const socketData = store.getState().sockets[socketId]

    if (socketData.messageCount >= settings.rateLimit) {                        // rate limit incoming messages
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
    if (message.length > settings.maxMessageCharLength) {                       // length limit
      throw new Error('MESSAGE_TOO_LONG')
    }

    const action = JSON.parse(message)                                          // don't parse until the above limits have been checked, parsing is expensive
    store.dispatch(socketReceive(socketId))                                     // data was received

    if (action.type === LOGIN_REQUEST) {
      await onLogin(socketId, action)
    } else if (socketData.userId) {
      await onAction(socketData.userId, action)
    }
  }
}
