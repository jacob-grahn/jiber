import { Action } from '../../core/index'

export default function sendAction (socket: WebSocket, action: Action): void {
  if (!action || !action.$hope || !action.$hope.roomId) return
  if (!socket || socket.readyState !== socket.OPEN) return
  const roomId = action.$hope.roomId
  const smallerAction = {...action, $hope: {roomId}}
  const strAction = JSON.stringify(smallerAction)
  socket.send(strAction)
}
