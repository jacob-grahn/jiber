import {
  Action,
  HopeAction,
  Middleware,
  CLIENT,
  SERVER,
  CONFIRMED_STATE,
  join
} from '../../core/index'
import { ServerConnection } from '../server-connection'
import { LOGIN_RESULT } from '../reducers/hope-client/hope-actions'

// Send events to the master server
export default function sendToServer (
  serverConnection: ServerConnection,
  getState: Function
): Middleware {
  return (action: Action): Action => {
    if (action.$hope.source === CLIENT) {
      serverConnection.send(action)
    }

    if (action.$hope.source === SERVER && action.type === LOGIN_RESULT) {       // re-join rooms if reconnecting
      joinRooms(serverConnection, getState)
    }

    if (action.$hope.source === SERVER && action.type === CONFIRMED_STATE) {        // re-send pending actions if reconnecting
      setTimeout(() => {
        sendPendingActions(serverConnection, getState, action.$hope.roomId)
      }, 0)
    }

    return action
  }
}

function joinRooms (
  serverConnection: ServerConnection,
  getState: Function
) {
  const state = getState()
  const roomTypes = Object.keys(state)
  roomTypes.forEach(roomId => {
    serverConnection.send(join(roomId))
  })
}

function sendPendingActions (
  serverConnection: ServerConnection,
  getState: Function,
  roomId: string
) {
  const state = getState()
  const room = state.rooms[roomId]
  const myUserId = state.account.userId
  room.optimisticActions.forEach((action: HopeAction) => {
    if (action.$hope.userId === myUserId) {
      serverConnection.send(action)
    }
  })
}
