import { Action } from '../interfaces/action'
import { SERVER } from '../constants/trust-levels'
import { runSteps } from './run-steps'
import { determineAudience } from './determine-audience'
import { swiss } from '../swiss'

const SET_LOGIC = 'SET_LOGIC'

export const logic = (state: any = {}, action: any): any => {
  // action to set a user's logic
  // this should be called as the user is connecting
  if (action.type === SET_LOGIC && action.logic) {
    action.user._logic = action.logic
  }

  // Set a doc's logic when it is opened, but only if the doc hasn't had logic set yet
  if (state._logic === undefined) {
    if (action.user && action.user._logic) {
      state._logic = action.user._logic
    } else {
      state._logic = null
    }
  }

  // if the doc does not have logic set, then this meta reducer will do nothing
  if (!state || !state._logic) {
    return swiss(state, action)
  }

  // run logic and send out the resulting actions
  const actions = runSteps(state, action)
  actions.forEach((stepAction: Action) => {
    stepAction = determineAudience(stepAction)
    stepAction.trust = SERVER
    // next(stepAction)
  })

  return state
}