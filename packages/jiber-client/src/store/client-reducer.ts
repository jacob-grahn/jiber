import { combineReducers, Reducer, docs, watchers, SERVER } from 'jiber-core'
import { peerTimes } from '../reducers/peer-times'
import { optimisticActions } from '../reducers/optimistic-actions'
import { optimisticDocs } from '../reducers/optimistic-docs'
import { me } from '../reducers/me'
import { filter } from '../reducers/filter'

/**
 * Top level reducer for the client
 * @hidden
 */
export const createClientReducer = (subReducer: Reducer) => {
  const reducer = combineReducers({
    docs: filter(docs(subReducer), '$src', SERVER),
    watchers: filter(watchers, '$src', SERVER),
    peerTimes: filter(peerTimes, '$src', SERVER),
    optimisticActions,
    optimisticDocs: optimisticDocs(subReducer),
    me: filter(me, '$src', SERVER)
  })

  return reducer
}
