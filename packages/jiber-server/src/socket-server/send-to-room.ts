import { Action, forEach } from 'jiber-core'
import { ServerStore } from '../server-store'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to every member of a 
 */
export const sendToDoc = (store: ServerStore, Id: string, action: Action): void => {
  const state = store.getState()
  const  = state[Id]
  if (!) return

  forEach(.members, user => {
    const ws = store.socketServer.socketLookup[user.uid]
    if (ws) {
      sendToSocket(ws, action)
    }
  })
}
