/* global test, expect */

import { Action } from '../interfaces'
import { SERVER, SELF, PEER } from '../constants'
import { FlexStore } from './flex-store'
import { Packet } from './packet'

const reducer = (state: string, action: Action) => state + ' ' + action.value

test('default to an undefined state', () => {
  const store = new FlexStore(reducer)
  expect(store.getState()).toBe(undefined)
})

test('accept an initial state', () => {
  const store = new FlexStore(reducer, 'hi')
  expect(store.getState()).toBe('hi')
})

test('update state with an action', () => {
  const store = new FlexStore(reducer, 'hi')
  const action = { value: 'there' }
  store.receive(new Packet({ trust: SELF, payload: action }))
  expect(store.getState()).toBe('hi there')
})

test('seperate optimistic states', () => {
  const store = new FlexStore(reducer, 'hi')
  const serverPacket = new Packet({ trust: SERVER, payload: { value: 'server' } })
  const selfPacket = new Packet({ trust: SELF, payload: { value: 'self' } })
  const peerPacket = new Packet({ trust: PEER, payload: { value: 'peer' } })
  store.receive(serverPacket)
  store.receive(selfPacket)
  store.receive(peerPacket)
  expect(store.getState(SERVER)).toBe('hi server')
  expect(store.getState(SELF)).toBe('hi server self')
  expect(store.getState(PEER)).toBe('hi server self peer')
})
