import { Action, ServerState } from '../interfaces'
import { Packet } from '../packet'

export const broadcast = (state: ServerState) => (next: Function) => (action: Action) => {
  const docId = action.$docId
  const { subscriptions, socketServer } = state
  const subscribers = subscriptions[docId]
  if (subscribers) {
    const message = JSON.stringify(new Packet({ payload: action }))
    subscribers.forEach(userId => socketServer.send(userId, message))
  }
  next()
}
