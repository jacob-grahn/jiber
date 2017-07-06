import {
  HopeAction,
  Reducer,
  combineReducers,
  actionIds,
  lastUpdatedAt,
  createConfirmedState
} from '../../../core/index'
import optimisticActions from './optimistic-actions'
import createOptimisticState from './optimistic-state'
import status from './status'

// Reducer
export default function createRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  const optimisticState = createOptimisticState(subReducer)
  const intermediateReducer = combineReducers({
    actionIds,
    confirmedState,
    optimisticActions,
    status,
    lastUpdatedAt
  })

  return function roomReducer (state: any = {}, action: HopeAction): any {
    const intermediateState = intermediateReducer(state, action)
    return {
      ...intermediateState,
      optimisticState: optimisticState(
        state.optimisticState,
        action,
        intermediateState
      )
    }
  }
}
