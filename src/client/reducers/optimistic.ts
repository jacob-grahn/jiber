import { SET_STATE, ADD_CONFIRMED_ACTION} from './optimistic-action-types'
import { Action, Reducer } from '../../core/index'

interface OptimisticState {
  confirmed: any,
  optimistic: any,
  actions: Array<Action>
}

/**
 * A higher order reducer that adds optimistic state management
 */
export default function optimistic (reducer: Function): Reducer {
  return (state: OptimisticState, action: Action = {}): OptimisticState => {
    switch (action.type) {
      case undefined:
        return makeDefaultState(reducer)

      case SET_STATE:
        return setConfirmedState(reducer, state, action)

      case ADD_CONFIRMED_ACTION:
        return addConfirmedAction(reducer, state, action)

      default:
        return addOptimisticAction(reducer, state, action)
    }
  }
}

/**
 * Return the default state
 */
function makeDefaultState (reducer: Function): OptimisticState {
  return {
    confirmed: reducer(),
    optimistic: reducer(),
    actions: []
  }
}

/**
 * Completely replace the current state with a new confirmed state
 */
function setConfirmedState (
  reducer: Function,
  state: OptimisticState,
  action: Action
): OptimisticState {
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
 */
function addConfirmedAction (
  reducer: Function,
  state: OptimisticState,
  action: Action
): OptimisticState {
  const actions = removeById(state.actions, action.quantumId)
  const confirmed = reducer(state.confirmed, action.confirmedAction)
  const optimistic = applyActions(reducer, confirmed, actions)
  return {
    confirmed,
    optimistic,
    actions
  }
}

/**
 * Apply an optimistic action to the optimistc state
 */
function addOptimisticAction (
  reducer: Function,
  state: OptimisticState,
  action: Action
): OptimisticState {
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
 */
function removeById (actions: Array<Action>, id: String) {
  return actions.filter(action => {
    return action.quantumId !== id
  })
}

/**
 * Applies a list of actions to a state
 */
function applyActions (
  reducer: Function,
  state: OptimisticState,
  actions: Array<Action>
): OptimisticState {
  return actions.reduce((state, action): OptimisticState => {
    return reducer(state, action)
  }, state)
}
