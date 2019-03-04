/* global test, expect */

import { Packet } from './packet'

test('default values', () => {
  const packet = new Packet()
  expect(packet.id).toBeTruthy()
  expect(packet.trust).toBe(0)
  expect(packet.time).toBe(0)
})

test('set values', () => {
  const packet = new Packet({ id: '5', trust: 3, time: 7 })
  expect(packet.id).toBe('5')
  expect(packet.trust).toBe(3)
  expect(packet.time).toBe(7)
})
