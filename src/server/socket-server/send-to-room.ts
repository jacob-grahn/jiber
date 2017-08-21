import { Action } from '../../core/index'
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
    const memberIds: string[] = Object.keys(room.members)
    memberIds.forEach(memberId => {
      const user = state.users[memberId]
      if (!user) return
      const socketId = user.socketId
      sendToSocket(socketId, action)
    })
  }
}
