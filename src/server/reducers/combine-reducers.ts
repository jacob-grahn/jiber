/**
 * Take a collection of reducers to produce a single reducer
 * @param  {Object}   reducers  Collection of reducers
 * @return {Function}           Result reducer
 */
export default function combineReducers (reducers) {
  const keys = Object.keys(reducers)

  return (state = {}, action = {}) => {
    return keys.reduce((state, key) => {
      const reducer = reducers[key]
      return {
        ...state,
        [key]: reducer(state[key], action)
      }
    }, state)
  }
}
