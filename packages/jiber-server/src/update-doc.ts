import { Action } from 'jiber-core'
import { ServerStore } from './server-store'

export const updateDoc = (store: ServerStore, action: Action): void => {
  if (!action.$doc) return
  store.socketServer.sendToDoc(action.$doc, action)
  store.dispatch(action)
}
