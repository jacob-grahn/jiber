import { Action, forEach } from 'jiber-core'
import { ServerState } from '../interfaces/server-state'
import { SendToSocket } from './send-to-socket'

export type CreateSendToRoom = (
  getState: () => ServerState,
  sendToSocket: SendToSocket
) => SendToRoom
export type SendToRoom = (roomId: string, action: Action) => void

/**
 * send an action to every member of a room
 */
export const createSendToRoom: CreateSendToRoom = (getState, sendToSocket) => {
  return (roomId, action) => {
    const state = getState()
    const room = state.rooms[roomId]
    if (!room || !room.members) return

    forEach(room.members, member => {
      const user = state.users[member.userId]
      if (!user || !user.socketId) return
      sendToSocket(user.socketId, action)
    })
  }
}
