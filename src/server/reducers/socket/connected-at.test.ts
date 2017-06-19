import connectedAt from './connected-at'
import { socketInit } from './socket'

const fakeSocket = {send: (str: string) => str, readyState: 0}

test('default to 0', () => {
  const state = undefined
  const action = {type: 'HI THERE!'}
  expect(connectedAt(state, action)).toEqual(0)
})

test('update on connection', () => {
  const state = undefined
  const action = socketInit('5', fakeSocket)
  expect(connectedAt(state, action)).toEqual(action.timeMs)
})
