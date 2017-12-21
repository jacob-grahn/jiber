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
  if (!action.$roomId) return false
  if (action.$source !== SELF) return false

  const room = state.rooms[action.$roomId]
  if (!room.members[peerUserId]) return false

  return true
}
