import { Action } from './action'
import { RoomState } from '../reducers/room'
import * as EventEmitter from 'events'

export interface DB {
  emitter: EventEmitter,
  pushAction: (action: Action) => void,
  fetchState: (roomId: string) => Promise<RoomState>,
  stashState: (roomId: string, state: RoomState) => void
}
