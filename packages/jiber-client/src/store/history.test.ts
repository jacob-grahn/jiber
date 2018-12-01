/* global test, expect */

import { History } from './history'
import { Packet } from './packet'

test ('add packet to end', () => {
  const h = new History()
  h.add(new Packet({ id: '1', time: 1 }))
  h.add(new Packet({ id: '2', time: 2 }))
  const packets = h.from(2)
  expect(packets.length).toBe(1)
  expect(packets[0].time).toEqual(2)
})

test ('replace existing packet with a lower trust', () => {
  const h = new History()
  h.add(new Packet({ id: '1', trust: 1, payload: 'hi' }))
  h.add(new Packet({ id: '1', trust: 2, payload: 'bye' }))
  const packets = h.from(0)
  expect(packets.length).toBe(1)
  expect(packets[0].payload).toEqual('bye')
})

test ('dont replace existing packet with a lower or equal trust', () => {
  const h = new History()
  h.add(new Packet({ id: '1', trust: 1, payload: 'hi' }))
  h.add(new Packet({ id: '1', trust: 1, payload: 'bye' }))
  const packets = h.from(0)
  expect(packets.length).toBe(1)
  expect(packets[0].payload).toBe('hi')
})
