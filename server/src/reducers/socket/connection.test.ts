import { INIT_SOCKET } from '../../core'
import { connection } from './connection'

const fakeSocket = {send: (str: string) => str, readyState: 0}

test('default to undefined', () => {
  const state = undefined
  const action = {type: 'HI THERE!'}
  expect(connection(state, action)).toEqual(undefined)
})

test('update on connection', () => {
  const state = undefined
  const action = {type: INIT_SOCKET, connection: fakeSocket}
  expect(connection(state, action)).toEqual(fakeSocket)
})
