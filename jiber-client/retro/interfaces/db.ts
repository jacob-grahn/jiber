import { Action } from './action'

export interface DB {
  close: () => void
  dispatch: (action: Action) => Promise<any>
  onaction?: (action: Action) => any
}
