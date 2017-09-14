import { Action } from 'jiber-core'
import * as ws from 'ws'
import { ServerState } from '../interfaces/server-state'

export type CreateSendToSocket = (getState: () => ServerState) => SendToSocket
export type SendToSocket = (socketId: string, action: Action) => void

/**
 * send an action to a particular socket
 */
export const createSendToSocket: CreateSendToSocket = (getState) => {
  return (socketId, action) => {
    const socket = getState().sockets[socketId]
    if (!socket || !socket.ws) return
    const ws: ws = socket.ws
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(action))
    }
  }
}
