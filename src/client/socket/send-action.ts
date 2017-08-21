import { Action } from '../../core/index'

export const sendAction = (socket: WebSocket, action: Action): void => {
  if (!action || !action.$roomId) return
  if (!socket || socket.readyState !== socket.OPEN) return

  const copy = {...action}
  copy.$timeMs = undefined
  copy.$actionId = undefined
  copy.$userId = undefined
  copy.$source = undefined

  const strAction = JSON.stringify(copy)
  socket.send(strAction)
}
