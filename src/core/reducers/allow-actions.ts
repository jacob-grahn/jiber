import Reducer from '../interfaces/reducer'
import Action from '../interfaces/action'

export default function (
  subReducer: Reducer,
  allowedActions: string[]
): Reducer {
  const defaultState: any = subReducer(undefined, {} as any)
  return function allowActions (
    state: any = defaultState,
    action: Action
  ): any {
    if (allowedActions.indexOf(action.type) === -1) return state
    return subReducer(state, action)
  }
}
