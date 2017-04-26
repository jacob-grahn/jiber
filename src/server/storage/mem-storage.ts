/**
 * Store a state in memory
 */
export default function memStorage () {
  let state: any

  function getState () {
    return state
  }

  function setState (newState: any) {
    state = newState
  }

  return {
    getState,
    setState
  }
}
