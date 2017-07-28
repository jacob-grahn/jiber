import { Action } from '../../core/index'
import * as ws from 'ws'
import ServerState from '../interfaces/server-state'

export default function createSendToSocket (getState: () => ServerState) {
  return function sendToSocket (socketId: string, action: Action): void {
    const socket = getState().sockets[socketId]
    if (!socket || !socket.connection) return
    const connection: ws = socket.connection
    if (connection.readyState === connection.OPEN) {
      connection.send(JSON.stringify(action))
    }
  }
}
