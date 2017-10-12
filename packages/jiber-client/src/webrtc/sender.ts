import { Action } from 'jiber-core'
import { ClientState } from '../interfaces/client-state'

/**
 * Send relevent actions direcly to your peer!
 */
export const createSender = (
  getState: () => ClientState,
  peerUserId: string,
  send: (action: Action) => void
) => {
  const onAction = (action: Action): void => {
    if (!action.$r) return

    const state = getState()
    if (action.$confirmed) return
    if (action.$u !== state.me.userId) return

    const room = state.rooms[action.$r]
    const memberIds = Object.keys(room.members)
    if (memberIds.indexOf(peerUserId) === -1) return

    send(action)
  }

  return {
    onAction
  }
}
