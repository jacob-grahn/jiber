import { Action } from 'jiber-core'
import { SocketLookup } from '../interfaces'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to a particular user
 */
export const sendToUser = (socketLookup: SocketLookup, uid: string, action: Action): void => {
  const ws = socketLookup[uid]
  if (ws) {
    sendToSocket(ws, action)
  }
}
