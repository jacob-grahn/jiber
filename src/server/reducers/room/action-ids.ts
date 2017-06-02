import { Action } from '../../../core/index'
import { ADD_MEMBER, REMOVE_MEMBER } from './room'

interface ActionIds {[userId: string]: number}

export default function actionIds (
  state: ActionIds = {},
  action: Action
): ActionIds {
  switch (action.type) {
    case ADD_MEMBER:
      if (state[action.userId]) return state
      return {...state, [action.userId]: 0}

    case REMOVE_MEMBER:
      const newState = {...state}
      delete newState[action.userId]
      return newState

    default:
      if (action.$hope && action.$hope.userId) {
        const userId = action.$hope.userId
        const actionId = state[userId]
        if (actionId || actionId === 0) {
          return {...state, [userId]: actionId + 1}
        }
      }
      return state
  }
}
