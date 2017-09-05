import { Action, Store, Middleware, Next } from '../../core/index'
import { nextActionId } from '../utils/next-action-id'

/**
 * Mostly this middleware exists to create an incrementing actionId
 * for local actions.
 * userId and timeMs are also added to create some consistency between
 * optimistic and confirmed actions
 */
export const injectMetadata: Middleware = (store: Store) => {
  return (next: Next) => (action: Action) => {
    if (!action.$roomId) return next(action)
    if (action.$actionId) return next(action)

    const roomId = action.$roomId
    const state = store.getState()
    const roomState = state.rooms[roomId]
    const userId = state.me.userId
    const metaAction = {
      ...action,
      $actionId: nextActionId(userId, roomState),
      $userId: userId,
      $timeMs: new Date().getTime()
    }

    return next(metaAction)
  }
}
