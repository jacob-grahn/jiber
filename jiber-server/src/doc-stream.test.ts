/* global test, expect */

import { DocStream } from './doc-stream'
import { SEND_TO_CONNECTION } from './constants'

let events: any[] = []
let doc: DocStream
const onSend = (connectionId: string, message: string) => {
  events.push([connectionId, message])
}

beforeEach(() => {
  events = []
  doc = new DocStream(3)
  doc.on(SEND_TO_CONNECTION, onSend)
})

test('send message to members', () => {
  doc.join('one')
  doc.join('two')
  doc.addMessage('hi')
  expect(events).toEqual([
    ['one', 'hi'],
    ['two', 'hi']
  ])
})

test('send history to new member', () => {
  doc.addMessage('hi_1')
  doc.addMessage('hi_2')
  doc.addMessage('hi_3')
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
  doc.addMessage('hi')
  expect(events).toEqual([
    ['one', 'hi']
  ])
})

test('remove member', () => {
  doc.join('one')
  doc.leave('one')
  doc.addMessage('hi')
  expect(events).toEqual([])
})

test('hold up to max history', () => {
  doc.addMessage('hi_1')
  doc.addMessage('hi_2')
  doc.addMessage('hi_3')
  doc.addMessage('hi_4')
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
