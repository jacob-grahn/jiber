import { Action, Reducer } from '../interfaces'
import { STATE } from '../constants/action-types'

export const doc = (reducer: Reducer) => (state: any, action: Action) => {
  switch (action.type) {
    case STATE:
      return action.state
    default:
      return reducer(state, action)
  }
}
