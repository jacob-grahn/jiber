import store from '../store'
import { socketReceive } from '../reducers/socket'
import onLogIn from './on-log-in'
import onAction from './on-action'

const LOG_IN = 'hope/LOG_IN'

export default async function onMessage (
  socketId: string,
  message: string
): Promise<void> {
  const socketData = store.getState().socketDict[socketId]
  const options = store.getState().options

  if (socketData.messageCount >= options.rateLimit.max) {                       // rate limit incoming messages
    throw new Error('RATE_LIMIT_EXCEEDED')
  }
  if (message.length > options.maxMessageLength) {                              // length limit
    throw new Error('MESSAGE_TOO_LONG')
  }

  const action = JSON.parse(message)                                            // don't parse until the above limits have been checked, parsing is expensive
  store.dispatch(socketReceive(socketId))                                       // data was received

  if (action.type === LOG_IN) {
    await onLogIn(socketId, action)
  } else if (socketData.userId) {
    await onAction(socketData.userId, action)
  }
}
