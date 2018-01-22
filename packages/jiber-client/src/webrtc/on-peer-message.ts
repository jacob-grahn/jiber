import { Action, Store, PEER } from 'jiber-core'

/**
 * Handle incoming peer messages
 * @hidden
 */
export const onPeerMessage = (store: Store, peerUserId: string) => (event: MessageEvent) => {
  const action: Action = JSON.parse(event.data)
  const docId = action.$doc
  if (!docId) return

  // make sure the user is a member of this doc
  const doc = store.getState().docs[docId]
  const members = doc.members
  const user = members[peerUserId]
  if (!user) return

  // add some metadata to the action
  action.$timeMs = new Date().getTime()
  action.$uid = peerUserId
  action.$src = PEER
  action.$user = user

  // optimistic
  store.dispatch(action)
}
