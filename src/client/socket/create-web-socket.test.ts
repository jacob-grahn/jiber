import { createWebSocket } from './create-web-socket'

test('it should throw an error, because WebSocket is undefined in node', () => {
  const url = 'some url'
  const credential = '123'
  let threw = false
  try {
    createWebSocket(url, credential)
  } catch (e) {
    threw = true
  }
  expect(threw).toBe(true)
})
