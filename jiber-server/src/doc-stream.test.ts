/* global test, expect */

import { DocStream } from './doc-stream'
import { SEND_TO_CONNECTION } from './constants'
import { swiss } from './swiss'

let events: any[] = []
let doc: DocStream
const onSend = (connectionId: string, message: string) => {
  events.push([connectionId, JSON.parse(message)])
}

beforeEach(() => {
  events = []
  doc = new DocStream('test-doc', swiss)
  doc.on(SEND_TO_CONNECTION, onSend)
})

test('send message to members', () => {
  doc.join('one')
  doc.join('two')
  doc.addAction({ type: 'hi' })

  expect(events[0][0]).toEqual('one')
  expect(events[0][1].type).toEqual('SET')

  expect(events[1][0]).toEqual('two')
  expect(events[1][1].type).toEqual('SET')

  expect(events[2][0]).toEqual('one')
  expect(events[2][1].type).toEqual('hi')

  expect(events[3][0]).toEqual('two')
  expect(events[3][1].type).toEqual('hi')
})

test('send state to new member', () => {
  doc.addAction({ type: 'SET', path: 'barrels', value: 5 })
  doc.join('one')
  const socketId = events[0][0]
  const event = events[0][1]
  expect(socketId).toEqual('one')
  expect(event.type).toEqual('SET')
  expect(event.path).toEqual('')
  expect(event.value).toEqual({ barrels: 5 })
})

test('do not add same member twice', () => {
  doc.join('one')
  doc.join('one')
  doc.addAction({ type: 'hi' })
  expect(events.length).toBe(2)
  expect(events[0][1].type).toBe('SET') // welcome message
  expect(events[1][1].type).toBe('hi') // hi
})

test('remove member', () => {
  doc.join('one')
  doc.leave('one')
  doc.addAction({ type: 'hi' })
  expect(events.length).toBe(1)
  expect(events[0][1].type).toBe('SET') // welcome message
})

test('send to connection only if they are a member', () => {
  doc.join('one')
  doc.sendToMember('two', JSON.stringify({ type: 'hi' }))
  doc.sendToMember('one', JSON.stringify({ type: 'hi' }))
  expect(events.length).toBe(2)
  expect(events[0][0]).toBe('one')
  expect(events[1][0]).toBe('one')
})

test('store state', () => {
  doc.addAction({ type: 'SET', path: 'say', value: 'yay' })
  expect(doc.state).toEqual({ say: 'yay' })
})
