import { Action, CLIENT, SERVER, PEER } from '../../../core/index'
import HopeAction from '../../interfaces/hope-action'
import { JOIN_RESULT } from './room-actions'
import addMeta from '../../utils/add-meta'
import { RoomState } from './room'

const namespace = 'hope/room'

export default function reducer (
  state: HopeAction[] = [],
  action: Action
): HopeAction[] {
  switch(action.type) {
    case JOIN_RESULT:
      return claimActions(state, action.myUserId)

      default:
        if (action.type.indexOf(namespace) === 0) {
          return state
        }

        if (!action.$hope.source || action.$hope.source === CLIENT) {           // untrusted local client actions
          const hopeAction = addMeta(action as any, action)
          return [...state, hopeAction]
        }

        if (action.$hope.source === SERVER) {                                   // trusted server actions
          return pruneActions(
            state,
            action.$hope.userId,
            action.$hope.actionId
          )
        }

        if (action.$hope.source === PEER) {                                     // untrusted peer actions
          return [...state, action as HopeAction]
        }

        return state
  }
}

/**
 * Assign a userId to actions that don't have a userId
 */
function claimActions (
  actions: HopeAction[],
  userId: string
): HopeAction[] {
  return actions.map(action => {
    if (action.$hope && action.$hope.userId) {
      return action
    }
    return {...action, $hope: {...action.$hope, userId}}
  })
}

/**
 * Remove actions that have the same userId, and a lesser or equal actionId
 */
function pruneActions (
  actions: HopeAction[],
  userId: String,
  actionId: number
): HopeAction[] {
  return actions.filter(action => {
    return (
      action && action.$hope && action.$hope.userId && action.$hope.actionId
      && (action.$hope.userId !== userId || action.$hope.actionId > actionId)
    )
  })
}
