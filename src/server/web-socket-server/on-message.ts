import store from '../store'
import { socketReceive } from '../reducers/sockets/socket-actions'
import onLogIn from './on-log-in'
import onAction from './on-action'

const rateLimitMax = 20                                                         // TODO: this should be user configurable
const LOG_IN = 'quantum-state/LOG_IN'

export default function onMessage (
  socketId: string,
  message: string
): void {
  store.commit(socketReceive(socketId))                                         // commit that data was received

  const socketData = store.state.socketDict[socketId]

  if (socketData.messageCount >= rateLimitMax) return                           // rate limit incoming messages

  try {
    const action = JSON.parse(message)
    const type = action.type
    if (action.type === LOG_IN) {
      onLogIn(socketId, action)
    } else if (socketData.userId) {
      onAction(socketData.userId, action)
    }
  }
  catch (e) {
    // Messages should be JSON
  }
}
