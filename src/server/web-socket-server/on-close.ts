import store from '../store'
import { socketRemove } from '../reducers/socket'
import { userRemove } from '../reducers/user'
import * as ws from 'ws'

export default function onClose (socketId: string): void {
  const socketData = store.state.socketDict[socketId]
  socketData.connection.removeAllListeners()
  if (socketData.userId) {
    store.commit(userRemove(socketData.userId))
  }
  store.commit(socketRemove(socketId))
}
