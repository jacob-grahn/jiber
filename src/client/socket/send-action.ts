import { Action } from '../../core/index'

export default function sendAction (socket: WebSocket, action: Action): void {
  if (!action || !action.$roomId) return
  if (!socket || socket.readyState !== socket.OPEN) return
  const strAction = JSON.stringify(action)
  socket.send(strAction)
}
