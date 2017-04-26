import { IAction } from './i-action'

export interface IMiddleware {
  (action: IAction, state: any): Promise<IAction>|IAction
}
