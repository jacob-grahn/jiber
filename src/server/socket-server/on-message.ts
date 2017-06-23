import { Action, Store } from '../../core/index'

export default function createOnMessage (
  store: Store,
  onAction: (userId: string, action: Action) => Promise<void>
) {
  return async function onMessage (
    socketId: string,
    message: string
  ): Promise<void> {
    const state = store.getState()                                              // look up their userId
    const userId = state.sockets[socketId].userId                               // state.sockets[socketId] should always exist, so this should be safe...
    const action = JSON.parse(message)
    await onAction(userId, action)
  }
}
