import { Reducer } from '../../core/index'

interface State {
  [key: string]: any
}

/**
 * Factory to create a dict reducer that stores sub-states by key,
 * and updates those sub-states using the provided reducer
 */
export default function dictReducer (
  reducer: Reducer,
  namespace: string
): Reducer {
  return (state: State, action: any = {}): State => {
    switch (action.type) {
      case undefined:
        return {}

      case `${namespace}/REMOVE}`:
        const key = action.key
        return {...state, [key]: null}

      default:
        if (action.type.indexOf(namespace) === 0) {
          const key = action.key
          const value = state[key]
          return {
            ...state,
            [key]: reducer(value, action)
          }
        }
        return state
    }
  }
}
