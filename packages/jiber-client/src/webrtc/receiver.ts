import { Action, Store } from 'jiber-core'

export const createReceiver = (store: Store, peerUserId: string) => {
  return (event: MessageEvent) => {
    const action: Action = JSON.parse(event.data)
    const roomId = action.$roomId
    if (!roomId) return

    const room = store.getState().rooms[roomId]
    const members = room.members
    const user = members[peerUserId]
    if (!user) return

    action.$timeMs = new Date().getTime()
    action.$userId = peerUserId
    action.$user = user
    store.dispatch(action)
  }
}
