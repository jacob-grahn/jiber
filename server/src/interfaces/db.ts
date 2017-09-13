import { Action, RoomState } from '../core'
import * as EventEmitter from 'events'

export interface DB {
  emitter: EventEmitter,
  pushAction: PushAction,
  fetchState: FetchState,
  stashState: StashState
}

export type PushAction = (roomId: string, action: Action) => Promise<void>
export type FetchState = (roomId: string) => Promise<RoomState>
export type StashState = (roomId: string, state: RoomState) => Promise<void>
