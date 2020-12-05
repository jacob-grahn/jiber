import { runSteps } from './run-steps'
import { swiss } from '../swiss'
import { SERVER, SELF } from '../constants'

export const logic = (rules?: any) => (state: any = {}, action: any): any => {

  // if the doc does not have logic set, then this meta reducer will do nothing
  if (!rules) {
    state = swiss(state, action)
    return state
  }

  // replay server's logic
  if (action.trust === SERVER) {
    state = swiss(state, action)
    if (action.$subActions) {
      action.$subActions.forEach((subAction: any) => {
        state = swiss(state, subAction)
      })
    }
    return state
  }

  // run optimistic logic locally
  if (action.trust === SELF) {

    // replay saved logic results
    if (action.$subActions) {
      action.$subActions.forEach((subAction: any) => {
        state = swiss(state, subAction)
      })
      return state
    }

    // or run logic
    state.$self = action.user
    state._logic = rules
    state = runSteps(state, action)
    action.user = state.$self
    delete state.$self
    return state
  }
}
