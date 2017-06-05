import { Dictionary } from '../core/index'

interface HopeClientState {
  rooms: Dictionary,
  connected: boolean,
  account: any
}

let state: HopeClientState

export function getState (): HopeClientState {
  return state
}

export function setState (state: HopeClientState): void {
  this.state = state
}
