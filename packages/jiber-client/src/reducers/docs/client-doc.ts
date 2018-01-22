import { Action, Reducer, createDoc, SERVER } from 'jiber-core'
import { pendingActions as pendingActionReducer } from './pending-actions'
import { createOptimistic } from './optimistic'

/**
 * Clients have a few additional fields to handle optimistic state
 * @hidden
 */
export interface ClientDocState {
  confirmed: any,
  optimistic: any,
  pendingActions: Action[]
}

/**
 * @hidden
 */
const defaultState: ClientDocState = {
  confirmed: undefined,
  optimistic: undefined,
  pendingActions: []
}

/**
 * Calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 * @hidden
 */
export const createClientDoc = (subReducer: Reducer): Reducer => {
  const docReducer = createDoc(subReducer)
  const optimistic = createOptimistic(subReducer)

  return (
    state: ClientDocState = defaultState,
    action: Action
  ): ClientDocState => {
    state.pendingActions = pendingActionReducer(state.pendingActions, action)
    if (action.$souce === SERVER) {
      state.confirmed = Reducer(state.confirmed, action)
    }
    state.optimistic = optimistic(state, action)

    return state
  }
}
