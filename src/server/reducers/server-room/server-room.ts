import {
  Reducer,
  combineReducers,
  actionIds,
  createConfirmedState
} from '../../../core/index'
import isUpdating from './is-updating'

export default function createServerRoom (subReducer: Reducer): Reducer {
  const confirmedState = createConfirmedState(subReducer)
  return combineReducers({
    actionIds,
    confirmedState,
    isUpdating
  })
}
