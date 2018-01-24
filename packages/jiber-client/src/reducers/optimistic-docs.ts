import { Reducer, SERVER, dictionary } from 'jiber-core'

/**
 * Use the current  state along with the action to calculate
 * a state that will be correct, assuming the server ends up confirming
 * all of the optimistic actions
 * @hidden
 */

const optimisticDoc = (reducer: Reducer) => (state: any, action: any) => {
  if (action.$src === SERVER) {
    if (!action.$$docState || !action.$$optimisticActions) return state
    const docState = action.$$docState[action.$doc]
    const optimisticActions = action.$$optimisticActions

    // copy is not needed if reducer does not mutate state
    // this could possibly be optional via the settings
    // it is just a pain to always write reducers that do not mutate
    const docStateCopy = docState ? JSON.parse(JSON.stringify(docState)) : docState

    return optimisticActions.reduce(reducer, docStateCopy)
  }
  return reducer(state, action)
}

export const optimisticDocs = (reducer: Reducer) => {
  return dictionary(optimisticDoc(reducer), '$doc')
}
