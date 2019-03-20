import { Action } from '../../action'
import { JiberServer } from '../../jiber-server'
import { get } from 'lodash'
import { SERVER } from '../../constants'
import { interpolate } from './interpolate'
import { comparisons } from './comparisons'

export const ALLOW = 'ALLOW'
export const DENY = 'DENY'

interface SecurityRuleTest {
  field: string,
  is: string,
  value: string | number | boolean | undefined
}

export interface SecurityRule {
  do: 'ALLOW' | 'DENY',
  if?: SecurityRuleTest[]
}

/* const rules: SecurityRule[] = [
  { do: 'ALLOW', if: [{field: 'path[0]', is: EQUAL, value: 'user.id'}] },
  { do: 'DENY' }
] */

const testRules = (ctx: any, rules: SecurityRule[]) => {
  let method: string = ''
  rules.some((rule) => {
    if (rule.if === undefined) {
      method = rule.do
      return true
    }

    const allRulesMatch = rule.if.every(({ field, is, value }) => {
      const compFunc = comparisons[is]
      const value1 = get(ctx, interpolate(ctx, field))
      const value2 = interpolate(ctx, value)
      return compFunc(value1, value2)
    })

    if (allRulesMatch) {
      method = rule.do
    }

    return allRulesMatch
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
