import { Reducer } from '../interfaces/reducer'
import { Action } from '../interfaces/action'
import get from '../utils/get'

export interface Dictionary {
  [key: string]: any
}

// Factory to create a dict reducer that stores sub-states by key,
// and updates those sub-states using the provided reducer
export default function createDictionary (
  reducer: Reducer,
  idKey: string
): Reducer {
  return function stateDictionary (
    state: Dictionary = {},
    action: Action
  ): Dictionary {
    const id = get(action, idKey)
    if (!id) return state

    return {
      ...state,
      [id]: reducer(state[id], action)
    }
  }
}
