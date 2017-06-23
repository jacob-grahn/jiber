import { Action, Store } from '../../core/index'

export default function createOnMessage (
  store: Store,
  onAction: (userId: string, action: Action) => Promise<void>,
  onLogin: (socketId: string, action: Action) => Promise<void>,
  sendToSocket: (socketId: string, actions: Action) => void
) {
  return async function onMessage (
    socketId: string,
    message: string
  ): Promise<void> {
    try {
      const state = store.getState()                                            // look up their userId
      const userId = state.sockets[socketId].userId                             // state.sockets[socketId] should always exist, so this should be safe...

      const action = JSON.parse(message)

      if (userId) {
        await onAction(userId, action)
      } else {
        await onLogin(socketId, action)                                         // without a userId, logging in is all you can do
      }
    } catch (e) {
      sendToSocket(socketId, {type: 'ERROR', message: e.message})
    }
  }
}
