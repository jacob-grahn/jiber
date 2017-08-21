import { ServerState } from '../interfaces/server-state'
import { OnAction } from './on-action'
import { SendToSocket } from './send-to-socket'

export type CreateOnMessage = (
  getState: () => ServerState,
  onAction: OnAction,
  sendToSocket: SendToSocket
) => OnMessage
export type OnMessage = (socketId: string, message: string) => void

/**
 * handles 'message' socket event
 * json decodes the message, and passes the result to onAction
 * if there is an error, it is written back to the socket
 */
export const createOnMessage: CreateOnMessage = (
  getState,
  onAction,
  sendToSocket
) => {
  return (socketId, message) => {
    try {
      const state = getState()
      const socket = state.sockets[socketId]
      if (!socket || !socket.userId) return
      const userId = socket.userId
      const action = JSON.parse(message)
      onAction(userId, action)
    } catch (e) {
      sendToSocket(socketId, e.message)
    }
  }
}
