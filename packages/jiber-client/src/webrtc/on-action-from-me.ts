import { Action } from 'jiber-core'
import { ClientState } from '../interfaces/client-state'

/**
 * If you are emitting an action to a room that your peer is also in,
 * send them the action
 */
export const createOnActionFromMe = (
  getState: () => ClientState,
  peerUserId: string,
  send: (action: Action) => void
) => {
  return (action: Action): void => {
    if (!action.$roomId) return

    const room = getState().rooms[action.$roomId]
    const memberIds = Object.keys(room.members)
    if (memberIds.indexOf(peerUserId) === -1) return

    send(action)
  }
}
