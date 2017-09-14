import { Action, REMOVE_SOCKET, LEAVE_ROOM, RoomState } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'
import { PushAction } from '../interfaces/db'

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
  const roomIds: string[] = Object.keys(rooms)
  const memberRoomIds = roomIds.filter(roomId => {
    const room = rooms[roomId]
    return room.members[userId]
  })
  memberRoomIds.forEach(roomId => {
    const action = {type: LEAVE_ROOM, $roomId: roomId, $userId: userId}
    return pushAction(action)
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
    const socketData: any = state.sockets[socketId] || {}
    const connection: {removeAllListeners: () => void} = socketData.connection

    if (!connection) return
    connection.removeAllListeners()

    if (socketData.userId) {
      removeUserFromRooms(pushAction, socketData.userId, state.rooms)
    }

    store.dispatch({type: REMOVE_SOCKET, socketId})
  }
}
