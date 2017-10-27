import { Action } from 'jiber-core'
import * as ws from 'ws'
import { ServerState } from '../interfaces/server-state'

/**
 * send an action to a particular socket
 */
export const sendToSocket = (
  getState: () => ServerState,
  socketId: string,
  action: Action
): void => {
  const socket = getState().sockets[socketId]
  if (!socket || !socket.ws) return
  const ws: ws = socket.ws
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(action))
  }
}
