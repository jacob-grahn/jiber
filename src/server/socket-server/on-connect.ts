import { Store, LOGIN_RESULT, INIT_SOCKET } from '../../core/index'
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

    const timeMs = new Date().getTime()
    const socketAction = {type: INIT_SOCKET, socketId, connection, timeMs}
    store.dispatch(socketAction)

    const action = {type: LOGIN_RESULT, user: user.public}
    sendToSocket(socketId, action)
  }
}
