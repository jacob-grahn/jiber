import {
  HopeAction,
  Reducer,
  combineReducers,
  members,
  lastUpdatedAt,
  confirmed
} from '../../../core/index'
import optimisticActions from './optimistic-actions'
import optimistic from './optimistic'

// Reducer
export default function createRoom (subReducer: Reducer): Reducer {
  const intermediateReducer = combineReducers({
    members,
    confirmed: confirmed(subReducer),
    optimisticActions,
    lastUpdatedAt
  })

  return function roomReducer (state: any = {}, action: HopeAction): any {
    const intermediateState = intermediateReducer(state, action)
    return {
      ...intermediateState,
      optimistic: optimistic(subReducer)(
        state.optimisticState,
        action,
        intermediateState
      )
    }
  }
}
