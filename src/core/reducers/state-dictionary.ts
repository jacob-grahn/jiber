import { Reducer } from '../interfaces/reducer'

export interface DictionaryState {
  [key: string]: any
}
export interface Options {
  keyName?: string
}

const defaultOptions = {
  keyName: 'id'
}

// Factory to create a dict reducer that stores sub-states by key,
// and updates those sub-states using the provided reducer
export default function createStateDictionary (
  reducer: Reducer,
  inputOptions: Options
): Reducer {
  const options = {...inputOptions, ...defaultOptions}
  const keyName = options.keyName

  return function stateDictionary (
    state: DictionaryState,
    action: any = {}
  ): DictionaryState {
    switch (action.type) {
      case undefined:
        return {}

      default:
        if (!action[keyName]) {
          return state
        }

        const key = action[keyName]
        const value = state[key]
        return {
          ...state,
          [key]: reducer(value, action)
        }
    }
  }
}
