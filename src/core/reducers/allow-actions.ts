import { Reducer } from '../interfaces/reducer'
import { Action } from '../interfaces/action'

/**
 * Whitelist of actions to allow through to the subReducer
 */
export const createAllowActions = (
  subReducer: Reducer,
  allowedActions: string[]
): Reducer => {
  const defaultState: any = subReducer(undefined, {} as any)
  return (state: any = defaultState, action: Action): any => {
    if (allowedActions.indexOf(action.type) === -1) return state
    return subReducer(state, action)
  }
}
