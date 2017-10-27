import { Action } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to a particular user
 */
export const sendToUser = (
  getState: () => ServerState,
  userId: string,
  action: Action
): void => {
  const state = getState()
  const user = state.users[userId]
  if (!user || !user.socketId) return
  sendToSocket(getState, user.socketId, action)
}
