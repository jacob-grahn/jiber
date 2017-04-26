import { IAction } from '../../core/i-action'
import { IMiddleware } from '../../core/i-middleware'

export default function sendToPeers (server): IMiddleware {
  return function (action: IAction) {
    return action
  }
}
