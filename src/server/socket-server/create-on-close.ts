import { Store } from '../../core/index'
import { socketRemove } from '../reducers/socket'
import { userRemove } from '../reducers/user'

export default function createOnClose (store: Store) {
  return function onClose (socketId: string): void {
    const socketData = store.getState().socketDict[socketId]
    socketData.connection.removeAllListeners()
    if (socketData.userId) {
      store.dispatch(userRemove(socketData.userId))
    }
    store.dispatch(socketRemove(socketId))
  }
}
