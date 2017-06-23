import { Store, loginResult } from '../../core/index'
import { socketInit } from '../reducers/socket/socket'
import * as ws from 'ws'

export default function createOnConnect (
  store: Store,
  onMessage: Function,
  onClose: Function,
  sendToSocket: Function
) {
  return function onConnect (connection: ws, request: any): void {
    const state = store.getState()
    const socketId = request.headers['sec-websocket-key']
    const userId = state.sockets[socketId].userId
    const user = state.users[userId]

    connection.on('message', async (message) => {
      try {
        await onMessage(socketId, message)
      } catch (e) {
        sendToSocket(socketId, e.message)
      }
    })

    connection.on('close', () => {
      onClose(socketId)
    })

    store.dispatch(socketInit(socketId, connection))
    sendToSocket(socketId, loginResult(user.public))
  }
}
