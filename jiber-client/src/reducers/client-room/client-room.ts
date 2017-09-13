import {
  Action,
  Reducer,
  combineReducers,
  members,
  lastUpdatedAt,
  createConfirmed
} from 'jiber-core'
import { optimisticActions } from './optimistic-actions'
import { createOptimistic } from './optimistic'
import { ClientRoomState } from '../../interfaces/client-room-state'

const defaultState: ClientRoomState = {
  members: {},
  confirmed: undefined,
  optimistic: undefined,
  optimisticActions: [],
  lastUpdatedAt: 0
}

/**
 * An overcomplicated reducer that calculates a confirmed state,
 * then uses the confirmed state to calculate an optimistic state
 * todo: find a simpler way to do this?
 */
export const createClientRoom = (subReducer: Reducer): Reducer => {
  const intermediateReducer = combineReducers({
    members,
    confirmed: createConfirmed(subReducer),
    optimisticActions,
    lastUpdatedAt
  })

  return (
    state: ClientRoomState = defaultState,
    action: Action
  ): ClientRoomState => {
    const intermediateState = intermediateReducer(state, action)
    return {
      ...intermediateState,
      optimistic: createOptimistic(subReducer)(
        state.optimistic,
        action,
        intermediateState
      )
    }
  }
}
