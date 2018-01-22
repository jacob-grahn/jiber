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
  if (!action.$doc) return false
  if (action.$source !== SELF) return false

  const  = state.s[action.$doc]
  if (!.members[peerUserId]) return false

  return true
}
