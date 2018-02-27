import { Action } from '../interfaces'
import { OPEN, CLOSE, DISCONNECT } from '../constants'

export const subscriptions = (state: any) => (next: Function) => (action: Action) => {
  const subs = state.subscriptions
  const docId = action.$docId
  const userId = action.$userId

  switch (action.type) {
    case OPEN:
      subs[docId] = subs[docId] || new Set()
      subs[docId].add(userId)
      return
    case CLOSE:
      if (subs[docId]) {
        subs[docId].delete(userId)
      }
      return
    case DISCONNECT:
      Object.values(subs).forEach(subscribers => subscribers.delete(userId))
      return
    default:
      next(action)
      return
  }
}
