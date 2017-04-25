import store from '../store'
import { socketRemove } from '../reducers/sockets/socket-dict-actions'
import { userRemove } from '../reducers/users/user-dict-actions'
import * as ws from 'ws'

export default function onClose (socketId: string): void {
  const socketData = store.state.socketDict[socketId]
  socketData.connection.removeAllListeners()
  if (socketData.userId) {
    store.commit(userRemove(socketData.userId))
  }
  store.commit(socketRemove(socketId))
}
