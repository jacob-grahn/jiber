import { Action, Store, PEER } from 'jiber-core'

export const onPeerMessage = (
  store: Store,
  peerUserId: string,
  event: MessageEvent
) => {
  const action: Action = JSON.parse(event.data)
  const roomId = action.$r
  if (!roomId) return

  // make sure the user is a member of this room
  const room = store.getState().rooms[roomId]
  const members = room.members
  const user = members[peerUserId]
  if (!user) return

  // add some metadata to the action
  action.$t = new Date().getTime()
  action.$u = peerUserId
  action.$source = PEER
  action.$user = user

  // optimistic
  store.dispatch(action)
}
