import { Action, forEach } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'
import { sendToSocket } from './send-to-socket'

/**
 * send an action to every member of a room
 */
export const sendToRoom = (
  getState: () => ServerState,
  roomId: string,
  action: Action
): void => {
  const state = getState()
  const room = state.rooms[roomId]
  if (!room || !room.members) return

  forEach(room.members, member => {
    const user = state.users[member.userId]
    if (!user || !user.socketId) return
    sendToSocket(getState, user.socketId, action)
  })
}
