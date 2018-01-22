import { Action, Reducer, createRoom, SERVER } from 'jiber-core'
import { pendingActions as pendingActionReducer } from './pending-actions'
import { createOptimistic } from './optimistic'

/**
 * Clients have a few additional fields to handle optimistic state
 * @hidden
 */
export interface ClientRoomState {
  confirmed: any,
  optimistic: any,
  pendingActions: Action[]
}

/**
 * @hidden
 */
const defaultState: ClientRoomState = {
  confirmed: undefined,
  optimistic: undefined,
  pendingActions: []
}

/**
 * Calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 * @hidden
 */
export const createClientRoom = (subReducer: Reducer): Reducer => {
  const roomReducer = createRoom(subReducer)
  const optimistic = createOptimistic(subReducer)

  return (
    state: ClientRoomState = defaultState,
    action: Action
  ): ClientRoomState => {
    state.pendingActions = pendingActionReducer(state.pendingActions, action)
    if (action.$souce === SERVER) {
      state.confirmed = roomReducer(state.confirmed, action)
    }
    state.optimistic = optimistic(state, action)

    return state
  }
}
