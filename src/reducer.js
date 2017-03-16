import { ActionTypes } from './actions'

/**
 * A higher order reducer that adds optimistic state management
 *  @param {Function} reducer - the wrapped reducer
 */
export default function syncable (reducer) {
  return (state = {}, action = {}) => {
    switch (action.type) {
      case undefined:
        return makeDefaultState(reducer)

      case ActionTypes.ADD_CONFIRMED_ACTION:
        return addConfirmedAction(reducer, state, action)

      case ActionTypes.SET_CONFIRMED_SATE:
        return setConfirmedState(reducer, state, action)

      default:
        return addOptimisticAction(reducer, state, action)
    }
  }
}

/**
 * Return the default state
 * @param {Function} reducer - the wrapped reducer
 * @returns {Object} - the default state
 */
function makeDefaultState (reducer) {
  return {
    confirmed: reducer(),
    optimistic: reducer(),
    actions: []
  }
}

/**
 * Apply a confirmed action to the confirmed state
 * Re-apply optimistic actions from there to create a new optimistic state
 * @param {Function} reducer - the wrapped reducer
 * @param {Object} state - the current state
 * @param {Object} action - the confirmed action to apply
 * @returns {Object} - the new state
 */
function addConfirmedAction (reducer, state, action) {
  const actions = withoutOld(state.actions, action.timeMs)
  const confirmed = reducer(state.confirmed, action.confirmedAction)
  const optimistic = applyActions(reducer, confirmed, optimistic)
  return {
    confirmed,
    optimistic,
    actions
  }
}

/**
 * Completely replace the current state with a new confirmed state
 * @param {Function} reducer - the wrapped reducer
 * @param {Object} state - the current state
 * @param {Object} action - an action containing the new state
 * @returns {Object} - the new state
 */
function setConfirmedState (reducer, state, action) {
  const actions = withoutOld(state.actions, action.timeMs)
  const confirmed = action.confirmedState
  const optimistic = applyActions(reducer, confirmed, actions)
  return {
    confirmed,
    optimistic,
    actions
  }
}

/**
 * Apply an optimistic action to the optimistc state
 * @param {Function} reducer - the wrapped reducer
 * @param {Object} state - the current state
 * @param {Object} action - the optimistic action
 * @returns {Object} - the new state
 */
function addOptimisticAction (reducer, state, action) {
  const _timeMs = new Date().time()
  const confirmed = state.confirmed
  const optimistic = reducer(state.optimistic, action)
  const actions = [...state.actions, {...action, _timeMs}]
  return {
    confirmed,
    optimistic,
    actions
  }
}

/**
 * Filters out actions with _timeMs less than minTimeMs
 * @param {Number} minTimeMs - actions newer than this will be returned
 * @param {Array} actions - list of actions to be filtered
 * @returns {Array} - new-ish actions
 */
function withoutOld (minTimeMs, actions) {
  return actions.filter(action => {
    return action._timeMs > minTimeMs
  })
}

/**
 * Applies a list of actions to a state
 * @param {function} reducer - The reducer that controls this state
 * @param {Object} state - The confirmed state to use as a starting point
 * @param {Array} actions - A list of actions to apply
 * @returns {Object} - result state
 */
function applyActions (reducer, state, actions) {
  return actions.reduce((state, action) => {
    return reducer(state, action)
  }, state)
}
