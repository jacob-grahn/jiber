/* global test, expect */

import { HiDBClient } from './hidb-client'
import { Action } from './action'

test('pass messages from server to docs', () => {
  const hidb = new HiDBClient()
  const doc = hidb.open('bloop')

  doc.subscription.subscribe((_state: any, action: any) => {
    expect(action.doc).toBe('bloop')
  })

  hidb.subscription.publish(new Action({ doc: 'bloop' }))
})
