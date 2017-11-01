import { reduce } from '../utils/reduce'
import { Reducer } from '../interfaces/reducer'

export interface ReducerDict {
  [key: string]: Reducer
}
export interface State {
  [key: string]: any
}

/**
 * Take a collection of reducers to produce a single reducer
 */
export const combineReducers = (reducerDict: ReducerDict): Reducer => {
  return (state: State = {}, action) => {
    return reduce(reducerDict, (state, reducer, key) => {
      return { ...state, [key]: reducer(state[key], action) }
    }, state)
  }
}
