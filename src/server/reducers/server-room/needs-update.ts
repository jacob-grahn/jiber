import { Action } from '../../../core/index'
import { BEGIN_UPDATE } from './is-updating'

// Action types
const NEEDS_UPDATE = 'hope/NEEDS_UPDATE'

// Reducer
export default function reducer (
  state: Boolean = false,
  action: Action
): Boolean {
  switch (action.type) {
    case NEEDS_UPDATE:
      return true

    case BEGIN_UPDATE:
      return false

    default:
      return state
  }
}

// Action creators
export function needsUpdate (roomId: string): Action {
  return {type: NEEDS_UPDATE, $hope: {roomId}}
}
