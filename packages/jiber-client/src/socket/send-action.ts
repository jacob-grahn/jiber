import { Action } from 'jiber-core'

/**
 * Send an action to the server
 */
export const sendAction = (socket: WebSocket, action: Action): void => {
  if (!action || !action.$roomId) return
  if (!socket || socket.readyState !== socket.OPEN) return

  socket.send(JSON.stringify(action))
}
