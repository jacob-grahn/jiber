import { Reducer } from '../interfaces/reducer'

export interface ReducerObj {
  [key: string]: Reducer
}
export interface State {
  [key: string]: any
}

/**
 * Take a collection of reducers to produce a single reducer
 */
export const combineReducers = (reducerObj: ReducerObj): Reducer => {
  const keys = Object.keys(reducerObj)

  return (state: State = {}, action) => {
    return keys.reduce((state, key: string) => {
      const reducer = reducerObj[key]
      return {
        ...state,
        [key]: reducer(state[key], action)
      }
    }, state)
  }
}
