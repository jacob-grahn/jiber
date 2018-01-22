import { Action, forEach } from 'jiber-core'
import { ServerStore } from '../server-store'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to every member of a
 */
export const sendToDoc = (store: ServerStore, docId: string, action: Action): void => {
  const state = store.getState()
  const doc = state[docId]
  if (!doc) return

  forEach(doc.members, user => {
    const ws = store.socketServer.socketLookup[user.uid]
    if (ws) {
      sendToSocket(ws, action)
    }
  })
}
