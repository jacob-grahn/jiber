import { Action } from './action'

export interface ActionCreators {
  [key: string]: (...args: any[]) => Action
}
