/* global test, expect */

import { JiberClient } from './jiber-client'
import { Action } from './action'

test('pass messages from server to docs', () => {
  const jiber = new JiberClient()
  const doc = jiber.open('bloop')

  doc.subscription.subscribe((_state: any, action: any) => {
    expect(action.doc).toBe('bloop')
  })

  jiber.subscription.publish(new Action({ doc: 'bloop' }))
})
