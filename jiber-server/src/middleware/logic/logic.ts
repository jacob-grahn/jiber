import { JiberServer } from '../../jiber-server'
import { Action } from '../../interfaces/action'
import { SERVER } from '../../constants/trust-levels'
import { runSteps } from './run-steps'
import { determineAudience } from './determine-audience'

const SET_LOGIC = 'SET_LOGIC'

export const logicMiddleware = (server: JiberServer) => (next: Function) => (action: Action) => {
  // shortcut variable
  const type = action.type

  // Set a user's logic
  if (type === SET_LOGIC && action.logic) {
    action.user._logic = action.logic
  }

  // Bail if the action doesn't specify a doc
  if (!action.doc) {
    next(action)
    return
  }

  // Get the doc
  const doc = server.getDoc(action.doc)

  // Set a doc's logic when it is opened, but only if the doc hasn't had logic set yet
  if (doc.state._logic === undefined) {
    if (action.user && action.user._logic) {
      doc.state._logic = action.user._logic
    } else {
      doc.state._logic = null
    }
  }

  // if the doc does not have logic set, then this middlware will do nothing
  if (!doc.state || !doc.state._logic) {
    next(action)
    return
  }

  // run logic and send out the resulting actions
  const logic = doc.state._logic
  if (logic[type]) {
    const steps = logic[type]
    const actions = runSteps(doc.state, steps, logic)
    actions.forEach((stepAction: Action) => {
      stepAction = determineAudience(stepAction)
      stepAction.id = action.id
      stepAction.trust = SERVER
      next(stepAction)
    })
    return
  }

  // catchall
  // TODO: need to make sure people to call SET, etc directly
  // next(action)
}
