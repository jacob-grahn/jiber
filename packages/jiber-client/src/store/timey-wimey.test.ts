/* global test, expect */

import { TimeyWimey } from './timey-wimey'
import { Packet } from './packet'

test('add a first packet', () => {
  const tw = new TimeyWimey()
  const packet = new Packet({ payload: 'test', time: 5 })
  const { state, packets } = tw.addPacket(packet)
  expect(state).toBeUndefined()
  expect(packets).toEqual([packet])
})

test('add a sequential packet', () => {
  const tw = new TimeyWimey()
  const packet1 = new Packet({ payload: 'test', time: 5 })
  const packet2 = new Packet({ payload: 'walk', time: 6 })
  tw.addPacket(packet1)
  const { state, packets } = tw.addPacket(packet2)
  expect(state).toBeUndefined()
  expect(packets).toEqual([packet1, packet2])
})

test('add an out-of-order packet', () => {
  const tw = new TimeyWimey()
  const packet1 = new Packet({ payload: 'test', time: 5 })
  const packet2 = new Packet({ payload: 'walk', time: 4 })
  tw.addPacket(packet1)
  const { state, packets } = tw.addPacket(packet2)
  expect(state).toBeUndefined()
  expect(packets).toEqual([packet2, packet1])
})

test('replace an packet', () => {
  const tw = new TimeyWimey()
  const packet1 = new Packet({ id: 'yay', payload: 'test' })
  const packet2 = new Packet({ id: 'yay', payload: 'test2', trust: 2 })
  tw.addPacket(packet1)
  const { state, packets } = tw.addPacket(packet2)
  expect(state).toBeUndefined()
  expect(packets).toEqual([packet2])
})

test('use snapshots', () => {
  const tw = new TimeyWimey()
  const packet1 = new Packet({ payload: 'test', time: 5 })
  const packet2 = new Packet({ payload: 'walk', time: 6 })
  tw.addPacket(packet1)
  tw.addSnapshot('a-snapshot', 5)
  const { state, packets } = tw.addPacket(packet2)
  expect(state).toBe('a-snapshot')
  expect(packets).toEqual([packet2])
})
