import { ActionConfig } from '../action'

export interface ActionCreators {
  [key: string]: (...args: any[]) => ActionConfig
}
