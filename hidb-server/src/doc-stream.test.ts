/* global test, expect */

import { DocStream } from './doc-stream'
import { SEND_TO_CONNECTION } from './constants'
import { swiss } from './swiss'

let events: any[] = []
let doc: DocStream
const onSend = (connectionId: string, message: string) => {
  if (message.length > 20) {
    events.push([connectionId, 'welcome']) // simplify welcome messages
  } else {
    events.push([connectionId, message])
  }
}

beforeEach(() => {
  events = []
  doc = new DocStream('test-doc', swiss)
  doc.on(SEND_TO_CONNECTION, onSend)
})

test('send message to members', () => {
  doc.join('one')
  doc.join('two')
  doc.addAction('hi')
  expect(events).toEqual([
    ['one', 'welcome'],
    ['two', 'welcome'],
    ['one', 'hi'],
    ['two', 'hi']
  ])
})

test('send state to new member', () => {
  doc.addAction('hi_1')
  doc.addAction('hi_2')
  doc.addAction('hi_3')
  doc.join('one')
  expect(events).toEqual([
    ['one', 'welcome']
  ])
})

test('do not add same member twice', () => {
  doc.join('one')
  doc.join('one')
  doc.addAction('hi')
  expect(events).toEqual([
    ['one', 'welcome'],
    ['one', 'hi']
  ])
})

test('remove member', () => {
  doc.join('one')
  doc.leave('one')
  doc.addAction('hi')
  expect(events).toEqual([
    ['one', 'welcome']
  ])
})

test('send to connection only if they are a member', () => {
  doc.join('one')
  doc.sendToMember('two', 'hi')
  doc.sendToMember('one', 'hi')
  expect(events).toEqual([
    ['one', 'welcome'],
    ['one', 'hi']
  ])
})

test('store state', () => {
  doc.addAction({ type: 'SET', path: 'say', value: 'yay' })
  expect(doc.state).toEqual({ say: 'yay' })
})
