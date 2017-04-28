import store from '../store'
import { socketReceive } from '../reducers/sockets/socket-actions'
import onLogIn from './on-log-in'
import onAction from './on-action'

const LOG_IN = 'quantum-state/LOG_IN'

export default function onMessage (
  socketId: string,
  message: string
): void {
  const socketData = store.state.socketDict[socketId]
  const options = store.state.options

  if (socketData.messageCount >= options.rateLimit.max) return                  // rate limit incoming messages
  if (message.length > options.maxMessageLength) return                         // length limit

  const action = JSON.parse(message)                                            // don't parse until the above limits have been checked, parsing is expensive
  store.commit(socketReceive(socketId))                                         // commit that data was received

  if (action.type === LOG_IN) {
    onLogIn(socketId, action)
  } else if (socketData.userId) {
    onAction(socketData.userId, action)
  }
}
