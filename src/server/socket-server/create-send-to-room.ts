import createSendToSocket from './create-send-to-socket'
import { Action, Store } from '../../core/index'

export default function createSendToRoom (store: Store) {
  const sendToSocket = createSendToSocket(store)

  return function sendToRoom (roomId: string, action: Action): void {
    const state = store.getState()
    const room = state.rooms[roomId]
    const memberIds: string[] = Object.keys(room.actionIds)
    memberIds.forEach(memberId => {
      const user = state.users[memberId]
      const socketId = user.socketId
      sendToSocket(socketId, action)
    })
  }
}
