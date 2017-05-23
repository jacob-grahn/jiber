import { Action, Middleware } from '../../core/index'
import Options from '../interfaces/options'

export default function sendToPeers (): Middleware {
  return function (action: Action): Action {
    return action
  }
}
