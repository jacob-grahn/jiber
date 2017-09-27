import { Action, Reducer, RoomState, createRoom } from 'jiber-core'
import { pendingActions } from './pending-actions'
import { createOptimistic } from './optimistic'

/**
 * Clients have a few additional fields to handle optimistic state
 */
export interface ClientRoomState extends RoomState {
  optimistic: any,
  pendingActions: Action[]
}

const defaultState: ClientRoomState = {
  lastUpdatedAt: 0,
  members: {},
  confirmed: undefined,
  optimistic: undefined,
  pendingActions: []
}

/**
 * An overcomplicated reducer that calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 */
export const createClientRoom = (subReducer: Reducer): Reducer => {
  const roomReducer = createRoom(subReducer)
  const optimistic = createOptimistic(subReducer)

  return (
    state: ClientRoomState = defaultState,
    action: Action
  ): ClientRoomState => {
    const newState = roomReducer(state, action)
    newState.pendingActions = pendingActions(state.pendingActions, action)
    newState.optimistic = optimistic(newState, action)
    return newState
  }
}
