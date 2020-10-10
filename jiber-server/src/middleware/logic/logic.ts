import { JiberServer } from '../../jiber-server'
import { Action } from '../../action'

export const logicMiddleware = (server: JiberServer) => (next: Function) => (action: Action) => {
  const doc = server.getDoc(action.doc)
  const type = action.type as string
  let logic = doc.state._logic

  // Set logic, but only if the doc hasn't has logic set yet
  if (!logic && action.user._logic) {
    logic = action.user._logic
    doc.state._logic = logic
  }

  // if the action type is handled by logic
  if (logic && logic[type]) {
    const steps = logic[type]
    const actions = logic(server.settings.reducer, doc.state, steps)
    actions.forEach((stepAction: Action) => next(stepAction))
  } else {
    next(action)
  }
}
