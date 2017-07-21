import { Action } from '../../core/index'
import ServerStore from '../interfaces/server-store'

export default function createSendToRoom (
  store: ServerStore,
  sendToSocket: Function
) {
  return function sendToRoom (roomId: string, action: Action): void {
    const state = store.getState()
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
