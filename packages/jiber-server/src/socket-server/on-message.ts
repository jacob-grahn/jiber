import { ServerState } from '../interfaces/server-state'
import { SendToSocket } from './send-to-socket'
import { PushAction } from 'jiber-core'

export type CreateOnMessage = (
  getState: () => ServerState,
  pushAction: PushAction,
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
  pushAction,
  sendToSocket
) => {
  return (socketId, message) => {
    try {
      const state = getState()
      const socket = state.sockets[socketId]
      if (!socket || !socket.userId) return
      const userId = socket.userId
      const action = JSON.parse(message)
      action.$u = userId
      pushAction(action)
    } catch (e) {
      sendToSocket(socketId, e.message)
    }
  }
}
