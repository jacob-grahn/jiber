import { combineReducers, me, optimisticDocs, optimisticActions, filter, docs, watchers } from '../reducers'
import { Reducer } from '../interfaces'
import { SERVER } from '../constants'
import { peerTimes } from '../reducers/peer-times'
import { exfiltrate } from '../reducers/exfiltrate'

/**
 * Top level reducer for the client
 * @hidden
 */
export const createClientReducer = (subReducer: Reducer) => {
  const reducer = combineReducers({
    docs: exfiltrate(filter(docs(subReducer), '$src', SERVER), '$$docIds'),
    watchers: filter(watchers, '$src', SERVER),
    peerTimes: filter(peerTimes, '$src', SERVER),
    optimisticActions: exfiltrate(optimisticActions, '$$optimisticActions'),
    optimisticDocs: optimisticDocs(subReducer),
    me: filter(me, '$src', SERVER)
  })

  return reducer
}
