import { Action, Store, Middleware } from '../../core/index'
import nextActionId from '../utils/next-action-id'

const injectMetadata: Middleware = (store: Store) => {
  return (next: Function) => (action: Action) => {
    if (!action.$hope || !action.$hope.roomId) return next(action)
    if (action.$hope.actionId) return next(action)

    const roomId = action.$hope.roomId
    const state = store.getState()
    const roomState = state.rooms[roomId]
    const userId = state.me.userId
    const hopeAction = {
      ...action,
      $hope: {
        actionId: nextActionId(userId, roomState),
        roomId,
        userId,
        timeMs: new Date().getTime()
      }
    }

    return next(hopeAction)
  }
}

export default injectMetadata
