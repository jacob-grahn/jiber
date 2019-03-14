/* global test, expect */

import { SERVER, SELF, PEER } from './constants'
import { FlexStore } from './flex-store'
import { Action } from './action'

const reducer = (state: string, action: any) => state + ' ' + action.value

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
  store.receive(new Action({ trust: SELF, value: 'there' }))
  expect(store.getState()).toBe('hi there')
})

test('seperate optimistic states', () => {
  const store = new FlexStore(reducer, 'hi')
  const serverAction = new Action({ trust: SERVER, value: 'server' })
  const selfAction = new Action({ trust: SELF, value: 'self' })
  const peerAction = new Action({ trust: PEER, value: 'peer' })
  store.receive(serverAction)
  store.receive(selfAction)
  store.receive(peerAction)
  expect(store.getState(SERVER)).toBe('hi server')
  expect(store.getState(SELF)).toBe('hi server self')
  expect(store.getState(PEER)).toBe('hi server self peer')
})

test('ignore late optimistic actions', () => {
  const store = new FlexStore(reducer, 'hi')
  const confirmedAction = new Action({ trust: SERVER, value: 'there' })
  const optimisticAction = new Action({ id: confirmedAction.id, trust: PEER, value: 'there' })
  store.receive(confirmedAction)
  store.receive(optimisticAction)
  expect(store.getState(PEER)).toBe('hi there')
})
