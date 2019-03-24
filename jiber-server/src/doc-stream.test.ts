/* global test, expect */

import { DocStream } from './doc-stream'
import { SEND_TO_CONNECTION } from './constants'
import { swiss } from './swiss'

let events: any[] = []
let doc: DocStream
const onSend = (connectionId: string, message: string) => {
  events.push([connectionId, message])
}

beforeEach(() => {
  events = []
  doc = new DocStream(swiss, 3)
  doc.on(SEND_TO_CONNECTION, onSend)
})

test('send message to members', () => {
  doc.join('one')
  doc.join('two')
  doc.addAction('hi')
  expect(events).toEqual([
    ['one', 'hi'],
    ['two', 'hi']
  ])
})

test('send history to new member', () => {
  doc.addAction('hi_1')
  doc.addAction('hi_2')
  doc.addAction('hi_3')
  doc.join('one')
  expect(events).toEqual([
    ['one', 'hi_1'],
    ['one', 'hi_2'],
    ['one', 'hi_3']
  ])
})

test('do not add same member twice', () => {
  doc.join('one')
  doc.join('one')
  doc.addAction('hi')
  expect(events).toEqual([
    ['one', 'hi']
  ])
})

test('remove member', () => {
  doc.join('one')
  doc.leave('one')
  doc.addAction('hi')
  expect(events).toEqual([])
})

test('hold up to max history', () => {
  doc.addAction('hi_1')
  doc.addAction('hi_2')
  doc.addAction('hi_3')
  doc.addAction('hi_4')
  doc.join('one')
  expect(events).toEqual([
    ['one', 'hi_2'],
    ['one', 'hi_3'],
    ['one', 'hi_4']
  ])
})

test('send to connection only if they are a member', () => {
  doc.join('one')
  doc.sendToMember('two', 'hi')
  doc.sendToMember('one', 'hi')
  expect(events).toEqual([
    ['one', 'hi']
  ])
})

test('store state', () => {
  doc.addAction({ type: 'SET', path: 'say', value: 'yay' })
  expect(doc.state).toEqual({ say: 'yay' })
})
