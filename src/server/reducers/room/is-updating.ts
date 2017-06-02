// true if this room in an update cycle

import { Action } from '../../../core/index'
import { BEGIN_UPDATE, FINISH_UPDATE } from './room'

export default function isUpdating (
  state: Boolean = false,
  action: Action
): Boolean {
  switch (action.type) {
    case BEGIN_UPDATE:
      return true

    case FINISH_UPDATE:
      return false

    default:
      return state
  }
}
