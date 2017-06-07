import store from '../store'
import { socketRemove } from '../reducers/socket'
import { userRemove } from '../reducers/user'

export default function onClose (socketId: string): void {
  const socketData = store.getState().socketDict[socketId]
  socketData.connection.removeAllListeners()
  if (socketData.userId) {
    store.dispatch(userRemove(socketData.userId))
  }
  store.dispatch(socketRemove(socketId))
}
