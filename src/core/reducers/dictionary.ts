import Reducer from '../interfaces/reducer'
import Action from '../interfaces/action'
import { get } from '../utils/get'

export interface Dictionary {
  [key: string]: any
}

/**
 * Factory to create a dict reducer that stores sub-states by key,
 * and updates those sub-states using the provided reducer
 */
export const createDictionary = (reducer: Reducer, idKey: string): Reducer => {
  return (state: Dictionary = {}, action: Action): Dictionary => {
    const id = get(action, idKey)
    if (!id) return state

    const subState = reducer(state[id], action)

    if (subState !== undefined) {
      return {
        ...state,
        [id]: subState
      }
    } else {
      const newState = {...state}
      delete newState[id]
      return newState
    }
  }
}
