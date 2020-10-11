import { JiberServer } from '../../jiber-server'
import { Action } from '../../interfaces/action'
import { SERVER } from '../../constants/trust-levels'
import { OPEN } from '../../constants/action-types'

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
    return
  }
  const doc = server.getDoc(action.doc)

  // Set a doc's logic when it is opened, but only if the doc hasn't has logic set yet
  if (type === OPEN && !doc.state._logic && action.user._logic) {
    doc.state._logic = action.user._logic
  }

  // shortcut variable
  const logic = doc.state._logic

  // if the doc does not have logic set, then this middlware will do nothing
  if (!logic) {
    next(action)
    return
  }

  // if there is logic, throw out actions that don't use one of the logic types
  if (!logic[type]) {
    return
  }

  // run logic and send out the resulting actions
  const steps = logic[type]
  const actions = logic(server.settings.reducer, doc.state, steps)
  actions.forEach((stepAction: Action) => {
    stepAction.id = action.id
    stepAction.trust = SERVER
    next(stepAction)
  })
}
