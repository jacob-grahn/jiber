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
  const watchers = state.watchers[action.$doc]
  if (!watchers || !watchers[peerUserId]) return false
  return true
}
