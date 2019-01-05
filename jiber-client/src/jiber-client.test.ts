/* global test, expect */

import { JiberClient } from './jiber-client'
import { Packet } from './packet'

test('pass messages from server to docs', () => {
  const jiber = new JiberClient()
  const doc = jiber.createDoc('bloop')

  doc.subscription.subscribe((_state: any, payload: any) => {
    expect(payload).toBe('doop')
  })

  jiber.subscription.publish(new Packet({ doc: 'bloop', payload: 'doop' }))
})
