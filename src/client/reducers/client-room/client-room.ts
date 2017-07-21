import {
  Action,
  Reducer,
  combineReducers,
  members,
  lastUpdatedAt,
  confirmed
} from '../../../core/index'
import optimisticActions from './optimistic-actions'
import optimistic from './optimistic'
import ClientRoomState from '../../interfaces/client-room-state'

const defaultState: ClientRoomState = {
  members: {},
  confirmed: undefined,
  optimistic: undefined,
  optimisticActions: [],
  lastUpdatedAt: 0
}

// Reducer
export default function createRoom (subReducer: Reducer): Reducer {
  const intermediateReducer = combineReducers({
    members,
    confirmed: confirmed(subReducer),
    optimisticActions,
    lastUpdatedAt
  })

  return function roomReducer (
    state: ClientRoomState = defaultState,
    action: Action
  ): ClientRoomState {
    const intermediateState = intermediateReducer(state, action)
    return {
      ...intermediateState,
      optimistic: optimistic(subReducer)(
        state.optimistic,
        action,
        intermediateState
      )
    }
  }
}
