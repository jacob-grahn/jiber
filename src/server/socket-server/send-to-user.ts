import { Action } from '../../core/index'
import { ServerState } from '../interfaces/server-state'
import { SendToSocket } from './send-to-socket'

export type CreateSendToUser = (
  getState: () => ServerState,
  sendToSocket: SendToSocket
) => SendToUser
export type SendToUser = (userId: string, action: Action) => void

/**
 * send an action to a particular user
 */
export const createSendToUser: CreateSendToUser = (getState, sendToSocket) => {
  return (userId, action) => {
    const state = getState()
    const user = state.users[userId]
    if (!user || !user.socketId) return
    sendToSocket(user.socketId, action)
  }
}
