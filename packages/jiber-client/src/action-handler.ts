import {
  Action,
  CONFIRMED_STATE,
  LOGIN_RESULT,
  JOIN_ROOM,
  forEach
} from 'jiber-core'
import { ClientState } from './interfaces/client-state'

/**
 * Trigger special behaviors for certain actions from the server
 */
export const actionHandler = (
  sendAction: (action: Action) => void,
  getState: () => ClientState,
  action: Action
): void => {
  switch (action.type) {

    // rejoin rooms
    case LOGIN_RESULT: {
      const state = getState()
      forEach(state.rooms, (_room, roomId) => {
        sendAction({ type: JOIN_ROOM, $r: roomId })
      })
      return
    }

    // resend pending actions
    case CONFIRMED_STATE: {
      if (!action.$r) return
      const state = getState()
      const room = state.rooms[action.$r]
      if (room) room.pendingActions.forEach(sendAction)
      return
    }
  }
}
