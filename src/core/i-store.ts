import { IAction } from './i-action'

export interface IStore {
  state: any,
  commit: {(action: IAction): any},
  dispatch: {(action: IAction): Promise<any>}
}
