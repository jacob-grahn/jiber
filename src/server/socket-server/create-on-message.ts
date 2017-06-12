import { Store } from '../../core/index'
import { socketReceive } from '../reducers/socket'

const LOG_IN = 'hope/LOG_IN'

export default function createOnMessage (
  store: Store,
  onLogIn: Function,
  onAction: Function
) {
  return async function onMessage (
    socketId: string,
    message: string
  ): Promise<void> {
    const socketData = store.getState().socketDict[socketId]
    const options = store.getState().options

    if (socketData.messageCount >= options.rateLimit.max) {                     // rate limit incoming messages
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
    if (message.length > options.maxMessageLength) {                            // length limit
      throw new Error('MESSAGE_TOO_LONG')
    }

    const action = JSON.parse(message)                                          // don't parse until the above limits have been checked, parsing is expensive
    store.dispatch(socketReceive(socketId))                                     // data was received

    if (action.type === LOG_IN) {
      await onLogIn(action)
    } else if (socketData.userId) {
      await onAction(socketData.userId, action)
    }
  }
}
