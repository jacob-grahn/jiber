import { Action } from './action'
import { RoomState } from './room-state'
import * as EventEmitter from 'events'

export interface DB {
  emitter: EventEmitter,
  pushAction: PushAction,
  fetchState: FetchState,
  stashState: StashState
}

export type PushAction = (action: Action) => void
export type FetchState = (roomId: string) => Promise<RoomState>
export type StashState = (roomId: string, state: RoomState) => void
