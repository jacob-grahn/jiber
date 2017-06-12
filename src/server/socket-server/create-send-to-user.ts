import { Action, Store } from '../../core/index'

export default function createSendToUser (
  store: Store,
  sendToSocket: Function
) {
  return function sendToUser (memberId: string, action: Action): void {
    const state = store.getState()
    const user = state.users[memberId]
    const socketId = user.socketId
    sendToSocket(socketId, action)
  }
}
