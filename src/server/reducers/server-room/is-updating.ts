import { Action } from '../../../core/index'

// Action types
const BEGIN_UPDATE = 'hope/BEGIN_UPDATE'
const FINISH_UPDATE = 'hope/FINISH_UPDATE'

// Reducer
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

// Action creators
export function beginUpdate (roomId: string) {
  return {type: BEGIN_UPDATE, $hope: {roomId}}
}

export function finishUpdate (roomId: string) {
  return {type: FINISH_UPDATE, $hope: {roomId}}
}
