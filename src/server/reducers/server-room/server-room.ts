import {
  Reducer,
  combineReducers,
  actionIds,
  lastUpdatedAt,
  createConfirmedState
} from '../../../core/index'
import isUpdating from './is-updating'
import needsUpdate from './needs-update'

export default function createServerRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  return combineReducers({
    actionIds,
    confirmedState,
    isUpdating,
    needsUpdate,
    lastUpdatedAt
  })
}
