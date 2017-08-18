import { Action, REMOVE_SOCKET, LEAVE_ROOM, RoomState } from '../../core/index'
import ServerState from '../interfaces/server-state'

/**
 * handles 'close' socket events
 * remove the user from all of the rooms they are in
 * remove event handlers from the socket, just in case
 * remove the socket from the store
 */
export default function createOnClose (
  store: {
    dispatch: (action: Action) => void,
    getState: () => ServerState
  },
  pushAction: (roomId: string, action: Action) => Promise<void>
) {
  return function onClose (socketId: string): void {
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

/**
 * remove the user from all of the rooms they are in
 * this is done at the db level, so they will be removed
 * from these rooms on all servers
 */
function removeUserFromRooms (
  pushAction: (roomId: string, action: Action) => Promise<void>,
  userId: string,
  rooms: {[roomId: string]: RoomState}
) {
  const roomIds: string[] = Object.keys(rooms)
  const memberRoomIds = roomIds.filter(roomId => {
    const room = rooms[roomId]
    return room.members[userId]
  })
  memberRoomIds.forEach(roomId => {
    const action = {type: LEAVE_ROOM, $roomId: roomId, $userId: userId}
    return pushAction(roomId, action)
  })
}
