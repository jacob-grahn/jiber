import { Action, CONFIRMED_STATE, LOGIN_RESULT } from 'jiber-core'

export type CreateActionHandler = (
  rejoinRooms: (socket: WebSocket) => void,
  resendPending: (socket: WebSocket, roomId: string) => void
) => ActionHandler
export type ActionHandler = (socket: WebSocket, action: Action) => void

/**
 * Trigger special behaviors for certain actions from the server
 */
export const createActionHandler: CreateActionHandler = (
  rejoinRooms,
  resendPending
) => {
  return (socket, action): void => {
    if (action.type === LOGIN_RESULT) {
      rejoinRooms(socket)
    }
    if (action.type === CONFIRMED_STATE) {
      if (!action.$roomId) return
      resendPending(socket, action.$roomId)
    }
  }
}
