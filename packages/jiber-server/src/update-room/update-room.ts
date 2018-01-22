import { Action } from 'jiber-core'
import { ServerStore } from '../server-store'

export const updateRoom = (store: ServerStore, action: Action): void => {
  if (!action.$doc) return
  store.socketServer.sendToRoom(action.$doc, action)
  store.dispatch(action)
}
