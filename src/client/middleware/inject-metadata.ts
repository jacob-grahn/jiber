import { Action, Store, Middleware, CLIENT } from '../../core/index'
import nextActionId from '../utils/next-action-id'
import { OPTIMISTIC_ACTION } from '../reducers/client-room/client-room'

const injectMetadata: Middleware = (store: Store) => {
  return (next: Function) => (action: Action) => {
    if (!action.$hope) return next(action)
    if (action.$hope.source) return next(action)

    const meta = action.$hope
    const roomId = (typeof meta === 'string') ? meta : meta.roomId
    const state = store.getState()
    const roomState = state.rooms[roomId]
    const userId = state.myUserId || ''
    return next({
      ...action,
      $hope: {
        type: OPTIMISTIC_ACTION,
        actionId: nextActionId(userId, roomState),
        roomId,
        source: CLIENT,
        userId,
        timeMs: new Date().getTime()
      }
    })
  }
}

export { injectMetadata as default }
