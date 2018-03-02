import { reduce } from '../utils/reduce'
import { Reducer } from '../interfaces/reducer'

export interface ReducerDict {
  [key: string]: Reducer
}

/**
 * Take a collection of reducers to produce a single reducer
 */
export const combineReducers = (dict: ReducerDict): Reducer => {
  return (state = {}, action) => {
    return reduce(dict, (state, reducer, key) => {
      return { ...state, [key]: reducer(state[key], action) }
    }, state)
  }
}
