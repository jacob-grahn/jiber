import { Action, Store, PEER } from 'jiber-core'

/**
 * Handle incoming peer messages
 * @hidden
 */
export const onPeerMessage = (store: Store, peerUserId: string) => (event: MessageEvent) => {
  const action: Action = JSON.parse(event.data)
  const roomId = action.$roomId
  if (!roomId) return

  // make sure the user is a member of this room
  const room = store.getState().rooms[roomId]
  const members = room.members
  const user = members[peerUserId]
  if (!user) return

  // add some metadata to the action
  action.$timeMs = new Date().getTime()
  action.$userId = peerUserId
  action.$source = PEER
  action.$user = user

  // optimistic
  store.dispatch(action)
}
