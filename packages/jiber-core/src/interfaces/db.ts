import { Action } from './action'
import { RoomState } from '../reducers/room'

export interface DB {
  pushAction: (action: Action) => void,
  fetchState: (roomId: string) => Promise<RoomState>,
  stashState: (roomId: string, state: RoomState) => void,
  onaction?: (action: Action) => void
}
