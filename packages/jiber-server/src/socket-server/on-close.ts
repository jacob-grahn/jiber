import { REMOVE_SOCKET, LEAVE_ROOM, forEach } from 'jiber-core'
import { ServerStore } from '../server-store'

/**
 * remove the user from all of the rooms they are in
 * this is done at the db level, so they will be removed
 * from these rooms on all servers
 */
const removeUserFromRooms = (
  store: ServerStore,
  userId: string,
  rooms: {[roomId: string]: any}
) => {
  forEach(rooms, (room, roomId) => {
    if (!room.members[userId]) return
    const action = { type: LEAVE_ROOM, $roomId: roomId, $userId: userId, $actionId: 999999999 }
    store.db.dispatch(action)
  })
}

/**
 * handles 'close' socket events
 * remove the user from all of the rooms they are in
 * remove event handlers from the socket, just in case
 * remove the socket from the store
 */
export const onClose = (store: ServerStore, socketId: string) => {
  const state = store.getState()
  const socket: any = state.sockets[socketId]
  if (!socket) return

  if (socket.userId) {
    removeUserFromRooms(store, socket.userId, state.rooms)
  }

  store.dispatch({ type: REMOVE_SOCKET, socketId })
}
