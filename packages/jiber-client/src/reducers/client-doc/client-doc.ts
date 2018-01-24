import { Action, Reducer, SERVER } from 'jiber-core'
import { pendingActions as pendingActionReducer } from './pending-actions'
import { createOptimistic } from './optimistic'
import { watchers, WatchersState } from './watchers'

/**
 * Clients have a few additional fields to handle optimistic state
 * @hidden
 */
export interface ClientDocState {
  confirmed: any,
  optimistic: any,
  pendingActions: Action[],
  watchers: WatchersState
}

/**
 * @hidden
 */
const defaultState: ClientDocState = {
  confirmed: undefined,
  optimistic: undefined,
  pendingActions: [],
  watchers: {}
}

/**
 * Calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 * @hidden
 */
export const createClientDoc = (subReducer: Reducer): Reducer => {
  const optimistic = createOptimistic(subReducer)

  return (
    state: ClientDocState = defaultState,
    action: Action
  ): ClientDocState => {
    if (action.$src === SERVER) {
      state.watchers = watchers(state.watchers, action)
      state.confirmed = subReducer(state.confirmed, action)
    }
    state.pendingActions = pendingActionReducer(state.pendingActions, action)
    state.optimistic = optimistic(state, action)

    return state
  }
}
