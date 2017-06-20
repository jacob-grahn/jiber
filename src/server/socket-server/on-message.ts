import { Action, Store } from '../../core/index'
import { socketReceive } from '../reducers/socket/socket'
import ServerSettings from '../interfaces/server-settings'

export default function createOnMessage (
  store: Store,
  settings: ServerSettings,
  onAction: (userId: string, action: Action) => Promise<void>,
  onLogin: (socketId: string, action: Action) => Promise<void>,
  sendToSocket: (socketId: string, actions: Action) => void
) {
  return async function onMessage (
    socketId: string,
    message: string
  ): Promise<void> {
    try {
      const socketData = store.getState().sockets[socketId]
      const userId = socketData.userId

      if (socketData.rateLimit.total >= settings.rateLimit) {                   // rate limit incoming messages
        throw new Error('RATE_LIMIT_EXCEEDED')
      }
      if (message.length > settings.maxMessageCharLength) {                     // length limit
        throw new Error('MESSAGE_TOO_LONG')
      }

      const action = JSON.parse(message)                                        // don't parse until the above limits have been checked, parsing is expensive
      store.dispatch(socketReceive(socketId))                                   // record that data was received for rate limiting

      if (userId) {
        await onAction(userId, action)
      } else {
        await onLogin(socketId, action)
      }
    } catch (e) {
      sendToSocket(socketId, {type: 'ERROR', message: e.message})
    }
  }
}
