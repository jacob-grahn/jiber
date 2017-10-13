import { Action, CONFIRMED_STATE, LOGIN_RESULT } from 'jiber-core'

/**
 * Trigger special behaviors for certain actions from the server
 */
export const createActionHandler = (
  rejoinRooms: () => void,
  resendPending: (roomId: string) => void
) => {
  return (action: Action): void => {
    switch (action.type) {
      case LOGIN_RESULT:
        return rejoinRooms()
      case CONFIRMED_STATE:
        return resendPending(action.$r || '')
    }
  }
}
