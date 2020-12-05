import md5 from 'md5'
import { runSteps } from './run-steps'
import { swiss } from '../swiss'

const SET_LOGIC = 'SET_LOGIC'
const logicMap: any = {}

export const logic = (state: any = {}, action: any): any => {
  // action to set a user's logic
  // this should be called as the user is connecting
  if (action.type === SET_LOGIC && action.logic) {
    const hash = md5(JSON.stringify(action.logic))
    logicMap[hash] = action.logic
    action.user._logic = hash
  }

  // Set a doc's logic when it is opened, but only if the doc hasn't had logic set yet
  if (state._logic === undefined) {
    if (action.user && action.user._logic) {
      state._logic = logicMap[action.user._logic]
    } else {
      state._logic = null
    }
  }

  // if the doc does not have logic set, then this meta reducer will do nothing
  if (!state || !state._logic) {
    return swiss(state, action)
  }

  // run logic
  state.$self = action.user
  state.$action = action
  state = runSteps(state, action)
  delete state.$self
  delete state.$action
  return state
}
