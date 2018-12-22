/* global test, expect */

import { Doc } from './doc'
import { Settings } from './settings'
import { Packet } from './packet'

test('wrap actions in packets', () => {
  const doc = new Doc('abc', new Settings({}))
  doc.sendSub.subscribe((packet: Packet) => {
    expect(packet.doc).toBe('abc')
    expect(packet.payload).toEqual({ type: 'hi' })
  })
  doc.dispatch({ type: 'hi' })
})

test('apply actions to optimistic state', () => {
  const doc = new Doc('abc', new Settings({}))
  doc.dispatchers.set('name', 'sue')
  expect(doc.getState()).toEqual({ name: 'sue' })
})
