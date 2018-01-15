import { ServerStore } from '../server-store'

/**
 * handles 'message' socket event
 * json decodes the message, and passes the result to onAction
 * if there is an error, it is written back to the socket
 */
export const onMessage = (
  store: ServerStore,
  socketId: string,
  message: string
) => {
  try {
    const state = store.getState()
    const socket = state.sockets[socketId]
    if (!socket || !socket.userId) return
    const userId = socket.userId
    const action = JSON.parse(message)
    action.$userId = userId
    store.db.dispatch(action)
  } catch (e) {
    store.socketServer.sendToSocket(socketId, e.message)
  }
}
