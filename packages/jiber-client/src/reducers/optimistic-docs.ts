import { Reducer } from '../interfaces'
import { SERVER } from '../constants'
import { dictionary } from './dictionary'

/**
 * Use the current  state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * @hidden
 */

const optimisticDoc = (reducer: Reducer) => (state: any, action: any) => {
  // hack to clean up the other hack to get this info into this reducer
  const docs = action.$$docIds
  const optimisticActions = action.$$optimisticActions
  delete action.$$docIds
  delete action.$$optimisticActions

  if (action.$src === SERVER) {
    if (!docs || !optimisticActions) return state
    const docState = docs[action.$docId]

    // copy is not needed if reducer does not mutate state
    // this could possibly be optional via the settings
    // it is just a pain to always write reducers that do not mutate
    const docStateCopy = docState ? JSON.parse(JSON.stringify(docState)) : docState
    return optimisticActions.reduce(reducer, docStateCopy)
  }
  return reducer(state, action)
}

export const optimisticDocs = (reducer: Reducer) => {
  return dictionary(optimisticDoc(reducer), '$docId')
}
