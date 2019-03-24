import { Action } from '../../action'
import { securityRules, SecurityRule, ALLOW, DENY } from './security-rules'
import { EQUAL, NOT_EQUAL, GREATER_THAN, LESS_THAN } from './comparisons'
import { SERVER } from '../../constants'
import { DocStream } from '../../doc-stream'
import { swiss } from '../../../../jiber-client/src/swiss'

let sendResult: any
let doc: DocStream
const server: any = {
  socketServer: {
    send: (socketId: string, message: string) => {
      sendResult = [socketId, message]
    }
  },
  getDoc: () => doc
}

let nextResult: any
const next = (action: any) => { nextResult = action }

beforeEach(() => {
  sendResult = undefined
  nextResult = undefined
  doc = new DocStream(swiss)
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
    { do: DENY, if: [{ field: 'action.name', is: EQUAL, value: 'bob' }] }, // does not match
    { do: ALLOW, if: [{ field: 'action.age', is: EQUAL, value: 50 }] }, // this should match
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
    { do: ALLOW, if: [{ field: 'action.age', is: NOT_EQUAL, value: 50 }] },
    { do: DENY }
  ]
  const action = new Action({ conn: 'bee', type: 'ha', age: 50 })
  securityRules(rules)(server)(next)(action)
  expect(sendResult[0]).toBe('bee')
})

test('deep match', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW, if: [{
      field: 'action.users[0].name.first', is: EQUAL, value: 'margo'
    }]},
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
    { do: DENY, if: [{ field: 'action.isCool', is: EQUAL, value: 'bloo' }] },
    { do: DENY, if: [{ field: 'action.isCool', is: EQUAL, value: undefined }] },
    { do: DENY, if: [{ field: 'action.isCool', is: NOT_EQUAL, value: false }] },
    { do: ALLOW }
  ]
  const action = new Action({ type: 'bro', isCool: false })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('bro')
})

test('interpolate', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW, if: [{
      field: 'action.path[0]',
      is: EQUAL,
      value: '${action.name.first}-${action.name.last}'
    }]},
    { do: DENY }
  ]
  const action = new Action({
    path: ['bob-lop', 'x'],
    name: { first: 'bob', last: 'lop' }
  })
  securityRules(rules)(server)(next)(action)
  expect(nextResult).toBeTruthy()
})

test('all rules must match', () => {
  const rules: SecurityRule[] = [
    { do: ALLOW, if: [
      { field: 'action.count', is: GREATER_THAN, value: 5 },
      { field: 'action.cost', is: LESS_THAN, value: 10 }
    ]},
    { do: DENY }
  ]

  // this should be denied
  const action = new Action({ count: 6, cost: 11 })
  securityRules(rules)(server)(next)(action)
  expect(sendResult).toBeTruthy()
  expect(nextResult).toBeFalsy()
  sendResult = nextResult = undefined

  // this should be allowed
  const action2 = new Action({ count: 6, cost: 9 })
  securityRules(rules)(server)(next)(action2)
  expect(sendResult).toBeFalsy()
  expect(nextResult).toBeTruthy()
})

test('match based on state', () => {
  doc.addAction({ type: 'SET', path: 'turn', value: 'bob' } as any)
  const rules: SecurityRule[] = [
    { do: ALLOW, if: [{ field: 'state.turn', is: EQUAL, value: 'bob' }] },
    { do: DENY }
  ]
  const action = new Action({ conn: 'bee', type: 'ha', age: 50 })
  securityRules(rules)(server)(next)(action)
  expect(nextResult.type).toBe('ha')
})
