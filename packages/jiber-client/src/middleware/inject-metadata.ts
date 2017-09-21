import { Action, Store, Middleware, Next } from 'jiber-core'

/**
 * userId and timeMs are added to create consistency between
 * optimistic and confirmed actions
 */

let nextActionId = 1

export const injectMetadata: Middleware = (store: Store) => {
  return (next: Next) => (action: Action) => {
    if (!action.$roomId) return next(action)
    if (action.$actionId) return next(action)

    const roomId = action.$roomId
    const state = store.getState()
    const roomState = state.rooms[roomId]
    if (!roomState) {
      return next(action)
    }

    const userId = state.me.userId
    const user = roomState.members[userId]

    const metaAction = {
      ...action,
      $actionId: nextActionId++,
      $user: user,
      $timeMs: new Date().getTime()
    }

    return next(metaAction)
  }
}
