import {
  Action,
  HopeAction,
  Middleware,
  Store,
  CLIENT,
  SERVER,
  CONFIRMED_STATE,
  join
} from '../../core/index'
import { ServerConnection } from '../server-connection'
import { LOGIN_RESULT } from '../reducers/hope-client/hope-actions'

export default function createSendToServer (
  server: ServerConnection
): Middleware {
  return (store: Store) => (next: Function) => (action: Action) => {
    if (!action.$hope) return next(action)                                      // ignore actions without metadata

    if (action.$hope.source === CLIENT) {
      server.send(action)
    }

    if (action.$hope.source === SERVER && action.type === LOGIN_RESULT) {       // re-join rooms if reconnecting
      rejoinRooms(server, store.getState())
    }

    if (action.$hope.source === SERVER && action.type === CONFIRMED_STATE) {    // re-send pending actions if reconnecting
      setTimeout(() => {
        const state = store.getState()
        const roomState = state.rooms[action.$hope.roomId]
        sendPendingActions(server, state, roomState)
      }, 0)
    }

    next(action)
  }
}

function rejoinRooms (
  serverConnection: ServerConnection,
  state: any
) {
  const roomTypes = Object.keys(state)
  roomTypes.forEach(roomId => {
    serverConnection.send(join(roomId))
  })
}

function sendPendingActions (
  serverConnection: ServerConnection,
  state: any,
  roomState: {optimisticActions: HopeAction[]}
) {
  roomState.optimisticActions.forEach((action: HopeAction) => {
    if (action.$hope.userId === state.myUserId) {
      serverConnection.send(action)
    }
  })
}
