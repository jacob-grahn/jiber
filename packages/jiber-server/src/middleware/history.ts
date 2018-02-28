import { Action, ServerState } from '../interfaces'

export const history = (state: ServerState) => (next: Function) => (action: Action) => {
  const { history, settings } = state
  const { actionTtl, maxHistory } = settings
  const docId = action.$docId
  const numActionTtl: number = (typeof actionTtl === 'function') ? actionTtl(docId) : Number(actionTtl)
  const numMaxHistory: number = (typeof maxHistory === 'function') ? maxHistory(docId) :  Number(maxHistory)
  const docHistory = history[docId] = history[docId] || []
  const time = new Date().getTime()

  action.$expireAt = time + numActionTtl
  docHistory.push(action)

  // enforce maxHistory
  if (docHistory.length > numMaxHistory) {
    docHistory.shift()
  }

  // enforce actionTtl
  while (docHistory.length && docHistory[docHistory.length - 1].$expireAt < time) {
    docHistory.shift()
  }

  // done!
  next(action)
}
