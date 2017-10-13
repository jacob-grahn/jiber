import {
  Action,
  RoomState,
  PushAction,
  REMOVE_SOCKET,
  LEAVE_ROOM,
  forEach
} from 'jiber-core'
import { ServerState } from '../interfaces/server-state'

export type CreateOnClose = (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  pushAction: PushAction
) => OnClose
export type OnClose = (socketId: string) => void

/**
 * remove the user from all of the rooms they are in
 * this is done at the db level, so they will be removed
 * from these rooms on all servers
 */
const removeUserFromRooms = (
  pushAction: PushAction,
  userId: string,
  rooms: {[roomId: string]: RoomState}
) => {
  forEach(rooms, (room, roomId) => {
    if (!room.members[userId]) return
    const action = {type: LEAVE_ROOM, $r: roomId, $u: userId, $id: 999999999}
    pushAction(action)
  })
}

/**
 * handles 'close' socket events
 * remove the user from all of the rooms they are in
 * remove event handlers from the socket, just in case
 * remove the socket from the store
 */
export const createOnClose: CreateOnClose = (store, pushAction) => {
  return (socketId) => {
    const state = store.getState()
    const socket: any = state.sockets[socketId] || {}
    const ws: {removeAllListeners: () => void} = socket.ws

    if (!ws) return
    ws.removeAllListeners()

    if (socket.userId) {
      removeUserFromRooms(pushAction, socket.userId, state.rooms)
    }

    store.dispatch({type: REMOVE_SOCKET, socketId})
  }
}
