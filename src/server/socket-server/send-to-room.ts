import { Action, Store } from '../../core/index'

export default function createSendToRoom (
  store: Store,
  sendToSocket: Function
) {
  return function sendToRoom (roomId: string, action: Action): void {
    const state = store.getState()
    const room = state.rooms[roomId]
    if (!room) return
    const memberIds: string[] = Object.keys(room.members)
    memberIds.forEach(memberId => {
      const user = state.users[memberId]
      if (!user) return
      const socketId = user.socketId
      sendToSocket(socketId, action)
    })
  }
}
