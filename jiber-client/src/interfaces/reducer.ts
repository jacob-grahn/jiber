import { Action } from './action'

export interface Reducer {
  (state: any, action: Action): any
}
