import { Action, Middleware } from '../../core'
import ServerOptions from '../interfaces/server-options'

export default function sendToPeers (server: ServerOptions): Middleware {
  return function (action: Action): Action {
    return action
  }
}
