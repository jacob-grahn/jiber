let state: any

function getState () {
  return state
}

function setState (newState: any) {
  state = newState
}

/**
 * Store a state in memory
 */
export default {
  getState,
  setState
}
