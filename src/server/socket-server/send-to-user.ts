import { Action } from '../../core/index'
import ServerState from '../interfaces/server-state'

export default function createSendToUser (
  getState: () => ServerState,
  sendToSocket: Function
) {
  return function sendToUser (userId: string, action: Action): void {
    const state = getState()
    const user = state.users[userId]
    if (!user) return
    const socketId = user.socketId
    sendToSocket(socketId, action)
  }
}
