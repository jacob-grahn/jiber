import { Action, Store } from '../../core/index'

export default function createSendToRoom (
  store: Store,
  sendToSocket: Function
) {
  return function sendToRoom (roomId: string, actions: Action[]): void {
    if (!actions || actions.length === 0) return
    const state = store.getState()
    const room = state.rooms[roomId]
    const memberIds: string[] = Object.keys(room.actionIds)
    memberIds.forEach(memberId => {
      const user = state.users[memberId]
      const socketId = user.socketId
      sendToSocket(socketId, actions)
    })
  }
}
