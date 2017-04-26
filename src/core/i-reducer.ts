import { IAction } from './i-action'

export interface IReducer {
  (state: any, action: IAction): any
}
