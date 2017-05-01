import { Action, Middleware } from '../../core'
import Options from '../interfaces/options'

export default function sendToPeers (options: Options): Middleware {
  return function (action: Action): Action {
    return action
  }
}
