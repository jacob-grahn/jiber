import {
  Action,
  STATE,
  LOGIN_RESULT,
  JOIN_ROOM,
  SERVER,
  forEach
} from 'jiber-core'
import { ClientStore } from '../store/client-store'

/**
 * Trigger special behaviors for certain actions from the server
 * @hidden
 */
export const onServerMessage = (store: ClientStore) => (event: MessageEvent) => {
  const action: Action = JSON.parse(event.data)
  action.$confirmed = true
  action.$source = SERVER

  switch (action.type) {

    // rejoin rooms
    case LOGIN_RESULT: {
      const state = store.getState()
      forEach(state.rooms, (_room, roomId) => {
        store.dispatch({ type: JOIN_ROOM, $roomId: roomId })
      })
      break
    }

    // resend pending actions
    case STATE: {
      if (!action.$roomId) return
      const state = store.getState()
      const room = state.rooms[action.$roomId]
      if (room) room.pendingActions.forEach(store.dispatch)
      break
    }
  }

  store.dispatch(action)
}
