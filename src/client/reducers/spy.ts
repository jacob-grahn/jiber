import { Action, Reducer } from '../../core/index'

export default function spyFactory (
  subReducer: Reducer,
  updateHandler: Function
): Reducer {
  return function spy (state: any, action: Action) {
    const nextState: any = subReducer(state, action)
    updateHandler(nextState)                                                    // side effect...
    return nextState
  }
}
