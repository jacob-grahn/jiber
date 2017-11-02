import { Action } from 'jiber-core'
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
  if (socket.ws.readyState === socket.ws.OPEN) {
    socket.ws.send(JSON.stringify(action))
  }
}
