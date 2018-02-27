import { Action, Reducer } from '../interfaces'
import { dictionary } from './dictionary'
import { STATE } from '../constants/action-types'

const doc = (reducer: Reducer) => (state: any, action: Action) => {
  switch (action.type) {
    case STATE:
      return action.state
    default:
      return reducer(state, action)
  }
}

export const docs = (reducer: Reducer) => dictionary(doc(reducer), '$docId')
