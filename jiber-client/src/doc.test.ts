/* global test, expect */

import { Doc } from './doc'
import { Settings } from './settings'

test('subscribe to changes', () => {
  const sendToServer = () => { /* do nothing */ }
  const doc = new Doc('abc', sendToServer, new Settings({}))
  doc.subscription.subscribe((_state: any, action: any) => {
    expect(action.type).toEqual('hi')
  })
  doc.dispatch({ type: 'hi' })
})

test('apply actions to optimistic state', () => {
  const sendToServer = () => { /* do nothing */ }
  const doc = new Doc('abc', sendToServer, new Settings({}))
  doc.dispatchers.set('name', 'sue')
  expect(doc.getState()).toEqual({ name: 'sue' })
})
