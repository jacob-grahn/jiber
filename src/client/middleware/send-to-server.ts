import { Action, Middleware } from '../../core'
import ServerOptions from '../interfaces/server-options'

/**
 * Send events to the master server
 */
export default function sendToServer (server: ServerOptions): Middleware {
  if (!server) return (action) => action                                        // if there is no server, return an empty middleware

  let socket
  let retryCount = 0


  return (action): Action => {
    return action
  }
}
