import sendAction from './send-action'

let sentMessages: string[]
const socket: any = {
  send: (message: string) => sentMessages.push(message)
}

beforeEach(() => {
  sentMessages = []
})

test('do nothing if there is no action', () => {
  sendAction(socket, undefined as any)
  expect(sentMessages.length).toBe(0)
})

test('do nothing if there is no roomId', () => {
  sendAction(socket, {type: 'hi'})
  expect(sentMessages.length).toBe(0)
})

test('do nothing if there is no socket', () => {
  sendAction(undefined as any, {type: 'hi', $roomId: 'room1'})
  expect(sentMessages.length).toBe(0)
})

test('do nothing if the socket is not connected', () => {
  const socket: any = {readyState: 0}
  sendAction(socket, {type: 'hi', $roomId: 'room1'})
  expect(sentMessages.length).toBe(0)
})

test('write good actions to the socket', () => {
  sendAction(socket, {type: 'hi', $roomId: 'room1'})
  expect(sentMessages).toEqual([
    JSON.stringify({type: 'hi', $roomId: 'room1'})
  ])
})

test('leave out everything but roomId', () => {
  sendAction(socket, {type: 'hi', $roomId: 'room1', $userId: 'yayaya'})
  expect(sentMessages).toEqual([
    JSON.stringify({type: 'hi', $roomId: 'room1'})
  ])
})
