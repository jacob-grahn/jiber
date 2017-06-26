import {
  Reducer,
  combineReducers,
  actionIds,
  lastUpdatedAt,
  createConfirmedState
} from '../../../core/index'

export default function createServerRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  return combineReducers({
    actionIds,
    confirmedState,
    lastUpdatedAt
  })
}
