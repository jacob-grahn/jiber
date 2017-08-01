import { Action, Store, Middleware } from '../../core/index'
import nextActionId from '../utils/next-action-id'

const injectMetadata: Middleware = (store: Store) => {
  return (next: Function) => (action: Action) => {
    if (!action.$roomId) return next(action)
    if (action.$actionId) return next(action)

    const roomId = action.$roomId
    const state = store.getState()
    const roomState = state.rooms[roomId]
    const userId = state.me.userId
    const hopeAction = {
      ...action,
      $actionId: nextActionId(userId, roomState),
      $roomId: roomId,
      $userId: userId,
      $timeMs: new Date().getTime()
    }

    return next(hopeAction)
  }
}

export default injectMetadata
