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
    state.$self = action.user
    state = swiss(state, action)
    if (action.$subActions) {
      action.$subActions.forEach((subAction: any) => {
        state = swiss(state, subAction)
      })
    }
    action.user = state.$self
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
    if (action.user && action.user.userId) {
      state.$self = `$users.${action.user.userId}`
    }
    state.$action = action
    state._logic = rules
    state = runSteps(state, action)
    delete state.$self
    delete state.$action
    return state
  }
}
