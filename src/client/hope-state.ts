import { RoomsState } from '../core/index'

let state: RoomsState = {}

export function getState (): RoomsState {
  return state
}

export function setState (state: RoomsState): void {
  this.state = state
}
