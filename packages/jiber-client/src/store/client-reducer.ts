import { combineReducers, Reducer, docs, watchers } from 'jiber-core'
import { peerTimes } from '../reducers/peer-times'
import { optimisticActions } from '../reducers/optimistic-actions'
import { optimisticDocs } from '../reducers/optimistic-docs'
import { me } from '../reducers/me'

/**
 * Top level reducer for the client
 * @hidden
 */
export const createClientReducer = (subReducer: Reducer) => {
  const reducer = combineReducers({
    docs: docs(subReducer),
    watchers,
    peerTimes,
    optimisticActions,
    optimisticDocs: optimisticDocs(subReducer),
    me
  })

  return reducer
}
