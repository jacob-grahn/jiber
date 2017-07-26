import { Action } from '../../core/index'
import ClientState from '../interfaces/client-state'

export default function resendPending (
  sendAction: (action: Action) => void,
  getState: () => ClientState,
  roomId: string
): void {
  const state = getState()
  const room = state.rooms[roomId]
  if (!room) return
  room.optimisticActions.forEach(sendAction)
}
