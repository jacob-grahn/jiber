/* global test, expect */

import { Doc } from './doc'
import { Settings } from './settings'
import { Packet } from './packet'

test('wrap actions in packets', () => {
  const sendToServer = () => {}
  const doc = new Doc('abc', sendToServer, new Settings({}))
  doc.subscription.subscribe((packet: Packet) => {
    expect(packet.doc).toBe('abc')
    expect(packet.payload).toEqual({ type: 'hi' })
  })
  doc.dispatch({ type: 'hi' })
})

test('apply actions to optimistic state', () => {
  const sendToServer = () => {}
  const doc = new Doc('abc', sendToServer, new Settings({}))
  doc.dispatchers.set('name', 'sue')
  expect(doc.getState()).toEqual({ name: 'sue' })
})
