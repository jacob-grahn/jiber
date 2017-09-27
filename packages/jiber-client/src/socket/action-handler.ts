import { Action, CONFIRMED_STATE, LOGIN_RESULT } from 'jiber-core'

/**
 * Trigger special behaviors for certain actions from the server
 */
export const createActionHandler = (
  rejoinRooms: () => void,
  resendPending: (roomId: string) => void
) => {
  return (action: Action): void => {
    if (action.type === LOGIN_RESULT) {
      rejoinRooms()
    }
    if (action.type === CONFIRMED_STATE) {
      if (!action.$roomId) return
      resendPending(action.$roomId)
    }
  }
}
