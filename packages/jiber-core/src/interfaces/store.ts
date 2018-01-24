import { Action } from './action'

export interface Store {
  getState: () => any,
  dispatch: (action: Action) => any,
  subscribe: (listener: Function) => Function
}
