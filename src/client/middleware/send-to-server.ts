import { IAction } from '../../core/i-action'
import { IMiddleware } from '../../core/i-middleware'

/**
 * Send events to the master server
 */
export default function sendToServer (server): IMiddleware {
  if (!server) return (action) => action                                        // if there is no server, return an empty middleware

  let socket
  let retryCount = 0


  return (action): IAction => {
    return action
  }


}
