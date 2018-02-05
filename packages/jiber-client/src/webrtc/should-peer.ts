import { Action, SELF } from 'jiber-core'
import { ClientState } from '../interfaces/client-state'

/**
 * Is this action relavent for this particular peer?
 * @hidden
 */
export const shouldPeer = (
  state: ClientState,
  peerUserId: string,
  action: Action
): boolean => {
  if (!action.$doc || action.$src !== SELF) return false

  const doc = state.docs[action.$doc]
  if (!doc) return false

  const watchers = doc.watchers
  if (!watchers || !watchers[peerUserId]) return false

  return true
}
