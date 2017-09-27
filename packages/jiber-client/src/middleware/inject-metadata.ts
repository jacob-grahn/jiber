import { Action, Store, Middleware, Next } from 'jiber-core'

/**
 * userId and timeMs are added to create consistency between
 * optimistic and confirmed actions
 */

let nextActionId = 1

export const injectMetadata: Middleware = (store: Store) => {
  return (next: Next) => (action: Action) => {
    // sanity checks
    const roomId = action.$roomId
    const state = store.getState()
    if (!roomId || !state.rooms[roomId]) return next(action)

    // fillin missing data
    if (!action.$actionId) action.$actionId = nextActionId++
    if (!action.$timeMs) action.$timeMs = new Date().getTime()

    // if there is no $userId, then this action was created by the current user
    if (action.$userId) {
      const room = state.rooms[roomId]
      action.$user = room.members[action.$userId]
    } else if (state.me) {
      action.$userId = state.me.userId
      action.$user = state.me
    }

    return next(action)
  }
}
