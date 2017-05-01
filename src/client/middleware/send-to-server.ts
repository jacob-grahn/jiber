import { Action, Middleware } from '../../core'
import Options from '../interfaces/options'

/**
 * Send events to the master server
 */
export default function sendToServer (options: Options): Middleware {
  let socket
  let retryCount = 0

  return (action): Action => {
    return action
  }
}
