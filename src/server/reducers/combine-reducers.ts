interface IReducerObj {
  [key: string]: Function
}
interface IState {
  [key: string]: any
}

/**
 * Take a collection of reducers to produce a single reducer
 * @param  {Object}   reducers  Collection of reducers
 * @return {Function}           Result reducer
 */
export default function combineReducers (reducerObj: IReducerObj): Function {
  const keys = Object.keys(reducerObj)

  return (state: IState, action = {}) => {
    return keys.reduce((state, key: string) => {
      const reducer = reducerObj[key]
      return {
        ...state,
        [key]: reducer(state[key], action)
      }
    }, state)
  }
}
