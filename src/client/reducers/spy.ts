import { Action, Reducer } from '../../core/index'
import { setState } from '../hope-state'

export default function spyFactory (subReducer: Reducer): Reducer {
  return function (state: any, action: Action) {
    const nextState: any = subReducer(state, action)
    setState(nextState)                                                         // side effect...
    return nextState
  }
}
