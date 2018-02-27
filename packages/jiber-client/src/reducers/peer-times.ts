import { Action, SERVER } from 'jiber-core'

export interface PeerTimesState {
  [userId: string]: number
}

export const peerTimes = (state: PeerTimesState = {}, action: Action): PeerTimesState => {
  if (action.$userId && action.$madeAt && action.$source === SERVER) {
    return { ...state, [action.$userId]: action.$madeAt }
  }
  return state
}
