import { Reducer } from '../interfaces/reducer'
import { Action } from '../interfaces/action'

export interface Dictionary {
  [key: string]: any
}

/**
 * Factory to create a dict reducer that stores sub-states by key,
 * and updates those sub-states using the provided reducer
 */
export const dictionary = (reducer: Reducer, idKey: string): Reducer => {
  return (state: Dictionary = {}, action: Action): Dictionary => {
    const id = action[idKey]
    if (!id) return state

    const newState: Dictionary = {
      ...state,
      [id]: reducer(state[id], action)
    }

    if (newState[id] === undefined) {
      delete newState[id]
    }

    return newState
  }
}
