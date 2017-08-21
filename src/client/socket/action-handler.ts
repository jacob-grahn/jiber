import { Action, CONFIRMED_STATE, LOGIN_RESULT } from '../../core/index'

export const createActionHandler = (
  rejoinRooms: (socket: WebSocket) => void,
  resendPending: (socket: WebSocket, roomId: string) => void
) => {
  return (socket: WebSocket, action: Action): void => {
    if (action.type === LOGIN_RESULT) {
      rejoinRooms(socket)
    }
    if (action.type === CONFIRMED_STATE) {
      if (!action.$roomId) return
      resendPending(socket, action.$roomId)
    }
  }
}
