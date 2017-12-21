import { Action } from 'jiber-core'

export interface ActionCreators {
  [key: string]: (...args: any[]) => Action
}
