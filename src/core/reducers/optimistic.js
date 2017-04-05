import { MASTER } from '../constants/source-types'
import { SET_STATE } from '../constants/action-types'

/**
 * A higher order reducer that adds optimistic state management
 *  @param {Function} reducer - the wrapped reducer
 */
export default function optimistic (reducer) {
  return (state = {}, action = {}) => {
    switch (action.type) {
      case undefined:
        return makeDefaultState(reducer)

      case SET_STATE:
        return setConfirmedState(reducer, state, action)

      default:
        if (action.realtimeSource === MASTER) {
          return addConfirmedAction(reducer, state, action)
        } else {
          return addOptimisticAction(reducer, state, action)
        }
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
 * Completely replace the current state with a new confirmed state
 * @param {Function} reducer - the wrapped reducer
 * @param {Object} state - the current state
 * @param {Object} action - an action containing the new state
 * @returns {Object} - the new state
 */
function setConfirmedState (reducer, state, action) {
  const actions = state.actions
  const confirmed = action.confirmedState
  const optimistic = applyActions(reducer, confirmed, actions)
  return {
    confirmed,
    optimistic,
    actions
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
  const actions = removeById(state.actions, action.quantumId)
  const confirmed = reducer(state.confirmed, action.confirmedAction)
  const optimistic = applyActions(reducer, confirmed, optimistic)
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
  const confirmed = state.confirmed
  const optimistic = reducer(state.optimistic, action)
  const actions = [...state.actions, action]
  return {
    confirmed,
    optimistic,
    actions
  }
}

/**
 * Filters out actions with _timeMs less than minTimeMs
 * @param {Array} actions - list of actions to be filtered
 * @param {String} id - the unique id of an action
 * @returns {Array} - left over actions
 */
function removeById (actions, id) {
  return actions.filter(action => {
    return action.quantumId !== id
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
