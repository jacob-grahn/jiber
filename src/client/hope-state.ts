import { Dictionary } from '../core/index'

export interface HopeClientState {
  rooms: Dictionary,
  connected: boolean,
  account: any
}

let state: HopeClientState

export function getState (): HopeClientState {
  return state
}

export function setState (newState: HopeClientState): void {
  state = newState
}
