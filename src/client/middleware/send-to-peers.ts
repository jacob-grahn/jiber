import { Action, Middleware } from '../../core/index'

export default function sendToPeers (): Middleware {
  return function (action: Action): Action {
    return action
  }
}
