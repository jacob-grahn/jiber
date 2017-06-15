import {
  default as socket,
  socketInit,
  socketSend,
  socketReceive
} from './socket'

const fakeSocket = {send: (str: string) => str, readyState: 0}

test('should default to something sane', () => {
  expect(socket(undefined, {type: 'wee'})).toEqual({
    connection: undefined,
    connectedAt: 0,
    lastSentAt: 0,
    lastReceivedAt: 0,
    period: 0,
    messageCount: 0
  })
})

test('update on connection', () => {
  const state = undefined
  const action = socketInit('5', fakeSocket)
  expect(socket(state, action)).toEqual({
    connection: fakeSocket,
    connectedAt: action.timeMs,
    lastSentAt: 0,
    lastReceivedAt: 0,
    period: 0,
    messageCount: 0
  })
})

test('update on send', () => {
  const state = {
    onnection: fakeSocket,
    connectedAt: 0,
    lastSentAt: 0,
    lastReceivedAt: 0,
    period: 0,
    messageCount: 0
  }
  const action = socketSend('1')
  expect(socket(state, action)).toEqual({
    onnection: fakeSocket,
    connectedAt: 0,
    lastSentAt: action.timeMs,
    lastReceivedAt: 0,
    period: 0,
    messageCount: 0
  })
})

test('update on receive', () => {
  const state = {
    onnection: fakeSocket,
    connectedAt: 0,
    lastSentAt: 0,
    lastReceivedAt: 0,
    period: 0,
    messageCount: 0
  }
  const action = socketReceive('1')
  expect(socket(state, action)).toEqual({
    onnection: fakeSocket,
    connectedAt: 0,
    lastSentAt: 0,
    lastReceivedAt: action.timeMs,
    period: action.period,
    messageCount: 1
  })
})
