import { dictionary, combineReducers, Reducer } from 'jiber-core'
import { createClientDoc } from './reducers/client-doc/client-doc'
import { me } from './reducers/me'

/**
 * Top level reducer for the client
 * @hidden
 */
export const createClientReducer = (subReducer: Reducer) => {
  const doc = createClientDoc(subReducer)
  const docs = dictionary(doc, '$doc')
  const clientReducer = combineReducers({ docs, me })
  return clientReducer
}
