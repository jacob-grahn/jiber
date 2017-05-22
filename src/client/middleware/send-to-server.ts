import { Action, Middleware, CLIENT } from '../../core/index'
import { getState } from '../hope-state'
import serverConnection from '../server-connection'

/**
 * Send events to the master server
 */
export default function sendToServer (): Middleware {
  return (action: Action): Action => {
    if (action.$hope.source === CLIENT) {
      serverConnection.send(action)
    }
    return action
  }
}
