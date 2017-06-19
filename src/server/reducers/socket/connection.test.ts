import connection from './connection'
import { socketInit } from './socket'

const fakeSocket = {send: (str: string) => str, readyState: 0}

test('default to undefined', () => {
  const state = undefined
  const action = {type: 'HI THERE!'}
  expect(connection(state, action)).toEqual(undefined)
})

test('update on connection', () => {
  const state = undefined
  const action = socketInit('5', fakeSocket)
  expect(connection(state, action)).toEqual(fakeSocket)
})
