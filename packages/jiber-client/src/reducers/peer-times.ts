import { Action, SERVER } from 'jiber-core'

export interface PeerTimesState {
  [uid: string]: number
}

export const peerTimes = (state: PeerTimesState = {}, action: Action): PeerTimesState => {
  if (action.$uid && action.$madeAt && action.$source === SERVER) {
    return { ...state, [action.$uid]: action.$madeAt }
  }
  return state
}
