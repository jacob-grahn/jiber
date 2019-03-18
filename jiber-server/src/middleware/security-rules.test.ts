import { Action } from '../action'
import { securityRules, SecurityRule, ALLOW, DENY } from './security-rules'
import { SERVER } from '../constants'

let sendResult: any
const server: any = {
  socketServer: {
    send: (socketId: string, message: string) => {
      sendResult = [socketId, message]
    }
  }
}

let nextResult: any
const next = (action: any) => { nextResult = action }

beforeEach(() => {
  sendResult = undefined
  nextResult = undefined
})

test('default to ALLOW', () => {
  const rules: SecurityRule[] = []
  const action = new Action({ type: 'hi' })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('hi')
})

test('rule with no condition is applied', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW }
  ]
  const action = new Action({ type: 'hi' })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('hi')
})

test('first rule to match is applied', () => {
  const rules: SecurityRule[] = [
    { do: DENY, if: 'name', equals: 'bob' }, // does not match
    { do: ALLOW, if: 'age', equals: 50 }, // this should match
    { do: DENY } // this matches, but should not run
  ]
  const action = new Action({ type: 'bye', age: 50 })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('bye')
})

test('return DENY action back to user', () => {
  const rules: SecurityRule[] = [
    { do: DENY }
  ]
  const action = new Action({ id: 'abc', conn: '123', doc: 'gang' })
  securityRules(rules)(server)(next)(action)
  expect(sendResult[0]).toBe('123')
  expect(sendResult[1]).toBe(JSON.stringify({
    id: 'abc',
    doc: 'gang',
    type: DENY,
    trust: SERVER
  }))
})

test('notEquals should not match a match', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW, if: 'age', notEquals: 50 },
    { do: DENY }
  ]
  const action = new Action({ conn: 'bee', type: 'ha', age: 50 })
  securityRules(rules)(server)(next)(action)
  expect(sendResult[0]).toBe('bee')
})

test('deep match', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW, if: 'users[0].name.first', equals: 'margo' },
    { do: DENY }
  ]
  const action = new Action({
    type: 'ba',
    users: [
      {
        name: {
          first: 'margo',
          last: 'simpson'
        }
      }
    ]
  })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('ba')
})

test('falsy edge cases', () => {
  const rules: SecurityRule[] = [
    { do: DENY, if: 'isCool', equals: 'bloo' },
    { do: DENY, if: 'isCool', equals: undefined },
    { do: DENY, if: 'isCool', notEquals: undefined },
    { do: ALLOW }
  ]
  const action = new Action({ type: 'bro', isCool: false })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('bro')
})
