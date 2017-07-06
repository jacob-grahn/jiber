import {
  Reducer,
  combineReducers,
  members,
  lastUpdatedAt,
  createConfirmedState
} from '../../../core/index'

export default function createServerRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  return combineReducers({
    members,
    confirmedState,
    lastUpdatedAt
  })
}
