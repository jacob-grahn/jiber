import { Action, Reducer } from '../../core/index'

interface OptimisticState {
  confirmed: any,
  optimistic: any,
  actions: Array<Action>
}

// Actions
const SET_STATE = 'hope/optimistic/SET_STATE'
const ADD_CONFIRMED_ACTION = 'hope/optimistic/ADD_CONFIRMED_ACTION'
const REMOVE_OPTIMISTIC_ACTION = 'hope/optimistic/REMOVE_OPTIMISTIC_ACTION'

// Reducer
export default function optimistic (reducer: Function): Reducer {
  return (state: OptimisticState, action: Action = {}): OptimisticState => {
    switch (action.type) {
      case undefined:
        return {
          confirmed: reducer(),
          optimistic: reducer(),
          actions: []
        }

      case SET_STATE:
        return {
          confirmed: action.confirmed,
          optimistic: applyActions(reducer, action.confirmed, state.actions),
          actions: state.actions
        }

      case ADD_CONFIRMED_ACTION:
        return {
          confirmed: reducer(state.confirmed, action.confirmedAction),
          optimistic: applyActions(reducer, state.confirmed, state.actions),
          actions: removeById(state.actions, action.id)
        }

      default:
        return {
          confirmed: state.confirmed,
          optimistic: reducer(state.optimistic, action),
          actions: [...state.actions, action]
        }
    }
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

// Action Creators
export function setState (state: any): Action {
  return {type: SET_STATE, state}
}

export function addConfirmedAction (action: Action): Action {
  return {type: ADD_CONFIRMED_ACTION, action}
}
