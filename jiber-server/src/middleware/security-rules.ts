import { Action } from '../action'
import { JiberServer } from '../jiber-server'
import { get } from 'lodash'
import { SERVER } from '../constants'

export const ALLOW = 'ALLOW'
export const DENY = 'DENY'

export interface SecurityRule {
  do: 'ALLOW' | 'DENY',
  if?: string,
  equals?: string | number | boolean,
  notEquals?: string | number | boolean
}

/* const rules: SecurityRule[] = [
  { do: 'ALLOW', if: 'path[0]', equals: 'user.id' },
  { do: 'DENY' }
] */

export const securityRules = (rules: SecurityRule[] = []) => (server: JiberServer) => (next: Function) => (action: Action) => {
  let method: string = ''

  rules.some((rule) => {
    if (!rule.if) {
      method = rule.do
    } else if (rule.equals !== undefined && get(action, rule.if) === rule.equals) {
      method = rule.do
    } else if (rule.notEquals !== undefined && get(action, rule.if) !== rule.notEquals) {
      method = rule.do
    }
    return !!method
  })

  // default to allow
  if (!method) {
    method = ALLOW
  }

  if (method === ALLOW) {
    next(action)
  }
  if (method === DENY) {
    server.socketServer.send(action.conn, JSON.stringify({
      id: action.id,
      doc: action.doc,
      type: DENY,
      trust: SERVER
    }))
  }
}
