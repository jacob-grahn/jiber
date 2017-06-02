import { Action } from '../../../core/index'
import { FINISH_UPDATE } from './room'

export default function confirmedState (state: any, action: Action): any {
  switch (action.type) {
    case FINISH_UPDATE:
      return action.confirmedState

    default:
      return state
  }
}
