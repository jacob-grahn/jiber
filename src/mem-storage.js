/**
 * Store a state in memory
 * @returns {Object} - object with getState and setState functions
 */
export default function memStorage () {
  let state

  function getState () {
    return state
  }

  function setState (newState) {
    state = newState
  }

  return {
    getState,
    setState
  }
}
