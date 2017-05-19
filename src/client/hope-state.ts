import { RoomsState } from './reducers/rooms'

let state: RoomsState = {}

export function getState (): RoomsState {
  return state
}

export function setState (state: RoomsState): void {
  this.state = state
}
