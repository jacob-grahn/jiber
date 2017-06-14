import { Store, removeUser } from '../../core/index'
import { socketRemove } from '../reducers/sockets'

export default function createOnClose (store: Store) {
  return function onClose (socketId: string): void {
    const socketData = store.getState().sockets[socketId]
    socketData.connection.removeAllListeners()
    if (socketData.userId) {
      store.dispatch(removeUser(socketData.userId))
    }
    store.dispatch(socketRemove(socketId))
  }
}
