import { runSteps } from './run-steps'
import { swiss } from '../swiss'
import { SERVER, SELF } from '../constants'

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

    if (action.$subActions) {
      action.$subActions.forEach((subAction: any) => {
        state = swiss(state, subAction)
      })
      return state
    }

    state.$self = action.user
    state = runSteps(state, action)
    action.user = state.$self
    delete state.$self
    return state
  }
}
