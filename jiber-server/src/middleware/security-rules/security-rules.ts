import { Action } from '../../action'
import { JiberServer } from '../../jiber-server'
import { get } from 'lodash'
import { SERVER } from '../../constants'
import { interpolate } from './interpolate'
import { comparisons } from './comparisons'

export const ALLOW = 'ALLOW'
export const DENY = 'DENY'

export interface SecurityRule {
  do: 'ALLOW' | 'DENY',
  if?: string,
  is?: string,
  to?: string | number | boolean
}

/* const rules: SecurityRule[] = [
  { do: 'ALLOW', if: 'path[0]', is: eq, to: 'user.id' },
  { do: 'DENY' }
] */

const testRules = (ctx: any, rules: SecurityRule[]) => {
  let method: string = ''
  rules.some((rule) => {
    if (rule.if === undefined || rule.is === undefined) {
      method = rule.do
      return true
    }
    const comp = comparisons[rule.is]
    const path = interpolate(ctx, rule.if)
    const value1 = get(ctx, path)
    const value2 = (typeof rule.to === 'string') ? interpolate(ctx, rule.to) : rule.to
    if (comp(value1, value2)) {
      method = rule.do
      return true
    }
    return false
  })
  return method
}

export const securityRules = (rules: SecurityRule[] = []) => (server: JiberServer) => (next: Function) => (action: Action) => {
  const ctx = { action }
  const method = testRules(ctx, rules) || ALLOW

  if (method === ALLOW) {
    next(action)
  } else {
    server.socketServer.send(action.conn, JSON.stringify({
      id: action.id,
      doc: action.doc,
      type: DENY,
      trust: SERVER
    }))
  }
}
