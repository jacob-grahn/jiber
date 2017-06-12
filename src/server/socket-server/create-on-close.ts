import { Store } from '../../core/index'
import { socketRemove } from '../reducers/sockets'
import { userRemove } from '../reducers/users'

export default function createOnClose (store: Store) {
  return function onClose (socketId: string): void {
    const socketData = store.getState().sockets[socketId]
    socketData.connection.removeAllListeners()
    if (socketData.userId) {
      store.dispatch(userRemove(socketData.userId))
    }
    store.dispatch(socketRemove(socketId))
  }
}
