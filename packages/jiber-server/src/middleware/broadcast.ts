import { Action, ServerState } from '../interfaces'

export const broadcast = (state: ServerState) => (next: Function) => (action: Action) => {
  const docId = action.$docIdId
  const { subscriptions, socketServer } = state
  const subscribers = subscriptions[docId]
  if (subscribers) {
    subscribers.forEach(userId => socketServer.send(userId, action))
  }
  next()
}
