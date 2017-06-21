import { Action, Store, leaveRoom } from '../../core/index'
import { socketRemove } from '../reducers/socket/socket'

export default function createOnClose (
  store: Store,
  addAction: (roomId: string, action: Action) => Promise<void>
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
        return room.actionIds[userId]
      })
      memberRoomIds.forEach(roomId => {
        const action = leaveRoom(roomId)
        action.$hope.userId = userId
        return addAction(roomId, action)
      })
    }

    store.dispatch(socketRemove(socketId))
  }
}
