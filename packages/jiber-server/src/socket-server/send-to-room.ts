import { Action, forEach } from 'jiber-core'
import { ServerStore } from '../server-store'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to every member of a room
 */
export const sendToRoom = (store: ServerStore, roomId: string, action: Action): void => {
  const state = store.getState()
  const room = state[roomId]
  if (!room) return

  forEach(room.members, user => {
    const ws = store.socketServer.socketLookup[user.uid]
    if (ws) {
      sendToSocket(ws, action)
    }
  })
}
