import {
  SET_STATE,
  ADD_CONFIRMED_ACTION
} from '../constants/action-types'
import { IAction } from '../i-action'

interface IOptimisticState {
  confirmed: any,
  optimistic: any,
  actions: Array<IAction>
}

/**
 * A higher order reducer that adds optimistic state management
 */
export default function optimistic (reducer: Function): Function {
  return (state: IOptimisticState, action: IAction = {}): IOptimisticState => {
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
function makeDefaultState (reducer: Function): IOptimisticState {
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
  state: IOptimisticState,
  action: IAction
): IOptimisticState {
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
  state: IOptimisticState,
  action: IAction
): IOptimisticState {
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
  state: IOptimisticState,
  action: IAction
): IOptimisticState {
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
function removeById (actions: Array<IAction>, id: String) {
  return actions.filter(action => {
    return action.quantumId !== id
  })
}

/**
 * Applies a list of actions to a state
 */
function applyActions (
  reducer: Function,
  state: IOptimisticState,
  actions: Array<IAction>
): IOptimisticState {
  return actions.reduce((state, action): IOptimisticState => {
    return reducer(state, action)
  }, state)
}
