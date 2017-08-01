import { Action, Store, REMOVE_SOCKET, LEAVE_ROOM } from '../../core/index'

export default function createOnClose (
  store: Store,
  pushAction: (roomId: string, action: Action) => Promise<void>
) {
  return function onClose (socketId: string): void {
    const state = store.getState()
    const socketData: any = state.sockets[socketId] || {}
    const connection: {removeAllListeners: () => void} = socketData.connection

    if (!connection) return
    connection.removeAllListeners()

    if (socketData.userId) {
      const userId = socketData.userId
      const roomIds: string[] = Object.keys(state.rooms)
      const memberRoomIds = roomIds.filter(roomId => {
        const room = state.rooms[roomId]
        return room.members[userId]
      })
      memberRoomIds.forEach(roomId => {
        const action = {type: LEAVE_ROOM, $roomId: roomId, $userId: userId}
        return pushAction(roomId, action)
      })
    }

    store.dispatch({type: REMOVE_SOCKET, socketId})
  }
}
