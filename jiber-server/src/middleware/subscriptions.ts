// TODO: remove docId key completely when there are no subscribers

import { Action, ServerState } from '../interfaces'
import { OPEN, CLOSE } from '../constants'

export const subscriptions = (state: ServerState) => (next: Function) => (action: Action) => {
  const subs = state.subscriptions
  const docId = action.$docId
  const userId = action.$userId

  switch (action.type) {
    case OPEN:
      subs[docId] = subs[docId] || new Set()
      subs[docId].add(userId)
      const docHistory = state.history[docId]
      if (docHistory) {
        docHistory.forEach(action => state.socketServer.send(userId, action))
      }
      return
    case CLOSE:
      if (subs[docId]) {
        subs[docId].delete(userId)
      }
      return
    default:
      next(action)
      return
  }
}
